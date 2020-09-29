'use strict';

const fsM = require('./shared/fetcherMain.js');
const fs1 = require('./shared/fetcherSupplier1.js');
const fs2 = require('./shared/fetcherSupplier2.js');
const http = require("http");
const url = require("url");
const fs = require("fs");


const port = process.argv[2] || 5050;

console.log(__dirname);
console.log("Server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");


const {graphql, buildSchema} = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    booking: [Booking],
    products: String,
    users: String
  }
  type Item {
    Id: Int!
    Category: String
    Name: String
    Description: String
    UnitPrice: Int!
    AmInStock: Int
  }
  type Booking {
    Item: Item
    AmRented: Int
    RentTime: Int
    StartTime: String
    EndTime: String
    RenterName: String
    RenterSurname: String
    RenterPhone: String
    RenterCardDet: String
  }
  input ItemInput {
    Id: Int!
    Name: String
    Description: String
    UnitPrice: Int!
    AmInStock: Int
  }
  input BookInput {
    id: String
    amount: String
    rentTime: String
    name: String
    surname: String
    phone: String
    card: String
  }
  type Mutation {
    book(message: BookInput): String
    addItem(toAdd: ItemInput): String
    changeItem(id: Int, toChange: ItemInput): String
    deleteItem(toDelete: ItemInput): String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    book: ({message}) => {
        return new Promise((resolve, rej) => {
            let details = message;
            details.id = parseInt(details.id);
            details.amount = parseInt(details.amount);
            details.rentTime = parseInt(details.rentTime);
            console.log(details);
            //base query details.id, callback as text, not {data: text}
            fsM.fetchPriceById(details.id, (err, res) => {
                if (!err) {
                    details.price = res;
                    details.now = new Date().toDateString();
                    console.log(details);
                    fsM.addBooking(details, (err, res) => {
                        console.log(err);
                        if (!err) {
                            resolve(JSON.stringify(res));
                        } else {
                            console.log('addBooking error, err: ', err);
                            rej(err);
                        }
                    });
                } else {
                    console.log('fetchPriceById error, err: ', err);
                    rej(err);
                }
            })
        })
    },
    addItem: ({toAdd}) => {
        // console.log(toAdd);
        return new Promise((resolve, rej) => {
            let details = toAdd;
            // details.Id = parseInt(details.Id);
            // details.UnitPrice = parseInt(details.UnitPrice);
            // details.AmInSotck = parseInt(details.AmInSotck);
            console.log('AAAAAAAAAAAAAAAA');
            console.log(details);
            fsM.addItem(details, res => resolve(res));
        });
    },
    changeItem: ({id, toChange}) => {
        //add id for item to be changed
        return new Promise((resolve, rej) => {
            let details = toChange;
            details.Id = parseInt(details.Id);
            details.UnitPrice = parseInt(details.UnitPrice);
            details.AmInSotck = parseInt(details.AmInSotck);
            fsM.changeItem(id, details, res => resolve(res));
        });
    },
    deleteItem: ({toDelete}) => {
        //transform toDelete?
        console.log(toDelete);
        return new Promise((resolve, rej) => {
            let details = toDelete;
            details.Id = parseInt(details.Id);
            details.UnitPrice = parseInt(details.UnitPrice);
            details.AmInSotck = parseInt(details.AmInSotck);
            fsM.deleteItem(details, res => resolve(res));
        });
    },
    booking: () => {
        console.log('//////////////////////////////////');
        return new Promise((resolve, rej) => {
            console.log('--------------------------------------------');
            fsM.fetchBookings(res => {
                console.log('``````````````````````````````');
                console.log(JSON.stringify(res));
                resolve(res);
                // resolve(JSON.stringify(res));
            });
        })
    },
    products: () => {
        let baseDB = new Promise((resolve, reject) => {
            fsM.fetchInventory((result) => {
                resolve(result);
            });
        });
        let supplier1 = new Promise(async (resolve, reject) => {
            fs1.fetchInventory((result) => {
                resolve(result);
            });
        });
        let supplier2 = new Promise((resolve, reject) => {
            fs2.fetchInventory((result) => {
                resolve(result);
            });
        });
        return new Promise((resolve, rej) => {
            Promise.all([baseDB, supplier1, supplier2]).then((values) => {
                resolve(JSON.stringify(values[0].concat(values[1]).concat(values[2])));
            });
        });

        // fsM.fetchInventory(res => JSON.stringify(res));
    },
    users: () => {
        return new Promise((resolve, rej) => {
            fsM.fetchUsers(res => resolve(JSON.stringify(res)));
        });
    },
};

http.createServer((req, res) => {
    const uri = url.parse(req.url).path;
    let data = '';

    if (uri === '/book') {
        req.on('data', (chunk) => {
            data += chunk;
        }).on('end', () => {

            const detailsArr = data.split('&');
            let details = {};
            detailsArr.forEach(det => {
                let data = det.split('=');
                details[data[0]] = data[1];
            });
            console.log(details);
            let query = 'mutation { book(message:{';
            for (const prop in details) {
                query += (prop + ': "' + details[prop] + '",')
            }
            query = query.slice(0, -1) + '})}';
            console.log('qqqqqqqqqqq');
            console.log(query);
            console.log('qqqqqqqqqqq');
            graphql(schema, query, root).then((response) => {
                console.log("GRAPH response");
                console.log(response);
                console.log(response.data);
                console.log(JSON.stringify(response.data));
                res.write(JSON.stringify(response.data));
                res.end();
            });
        });
    }


    if(uri === '/addItem') {
        req.on('data', (chunk) => {
            data += chunk;
        }).on('end', () => {
            const detailsArr = data.split('&');
            let details = {};
            detailsArr.forEach(det => {
                let data = det.split('=');
                details[data[0]] = data[1];
            });
            console.log('DETAILS!!!');
            details.Id = parseInt(details.Id);
            details.UnitPrice = parseInt(details.UnitPrice);
            details.AmInStock = parseInt(details.AmInStock);
            console.log(details);
            let query = 'mutation { addItem(toAdd:{';
            for (const prop in details) {
                if(prop === 'Name' || prop === 'Description') query += (prop + ': "' + details[prop] + '",')
                else query += (prop + ': ' + details[prop] + ',');
            }
            query = query.slice(0, -1) + '})}';
            console.log('qqqqqqqqqqq');
            console.log(query);
            console.log('qqqqqqqqqqq');
            graphql(schema, query, root).then((response) => {
                console.log("GRAPH response");
                console.log(response);
                console.log(response.data);
                console.log(JSON.stringify(response.data));
                res.write(JSON.stringify(response.data));
                res.end();
            });
        })
    }
    if(uri === '/changeItem') {
        req.on('data', (chunk) => {
            data += chunk;
        }).on('end', () => {
            const detailsArr = data.split('&');
            let details = {};
            detailsArr.forEach(det => {
                let data = det.split('=');
                details[data[0]] = data[1];
            });
            console.log(details);
            details.Id = parseInt(details.Id);
            details.UnitPrice = parseInt(details.UnitPrice);
            details.AmInStock = parseInt(details.AmInStock);
            const newId = details.ToChange;
            delete details.ToChange;
            let query = 'mutation { changeItem(id: ' + newId + ', toChange:{';
            for (const prop in details) {
                if(prop === 'Name' || prop === 'Description') query += (prop + ': "' + details[prop] + '",')
                else query += (prop + ': ' + details[prop] + ',');
            }
            query = query.slice(0, -1) + '})}';
            console.log('qqqqqqqqqqq');
            console.log(query);
            console.log('qqqqqqqqqqq');
            graphql(schema, query, root).then((response) => {
                console.log("GRAPH response");
                console.log(response);
                console.log(response.data);
                console.log(JSON.stringify(response.data));
                res.write(JSON.stringify(response.data));
                res.end();
            });
        })
    }
    if(uri === '/deleteItem') {
        req.on('data', (chunk) => {
            data += chunk;
        }).on('end', () => {
            const detailsArr = data.split('&');
            let details = {};
            detailsArr.forEach(det => {
                let data = det.split('=');
                details[data[0]] = data[1];
            });
            console.log(details);
            details.Id = parseInt(details.Id);
            details.UnitPrice = parseInt(details.UnitPrice);
            details.AmInStock = parseInt(details.AmInStock);
            let query = 'mutation { deleteItem(toDelete:{';
            for (const prop in details) {
                if(prop === 'Name' || prop === 'Description') query += (prop + ': "' + details[prop] + '",')
                else query += (prop + ': ' + details[prop] + ',');
            }
            query = query.slice(0, -1) + '})}';
            console.log('qqqqqqqqqqq');
            console.log(query);
            console.log('qqqqqqqqqqq');
            graphql(schema, query, root).then((response) => {
                console.log("GRAPH response");
                console.log(response);
                console.log(response.data);
                console.log(JSON.stringify(response.data));
                res.write(JSON.stringify(response.data));
                res.end();
            });
        })
    }

    if (uri === '/search') {
        req.on('data', (chunk) => {
            data += chunk;
        }).on('end', () => {
            let data2 = '{' + data.split('=')[1] + '}';
            if (data.split('=')[1] === 'book') {
                res.writeHead(302, {'Location': 'http://localhost:5050/booking.html'});
                res.end();
            } else if(data.split('=')[1] === 'addItem') {
                res.writeHead(302, {'Location': 'http://localhost:5050/addItem.html'});
                res.end();
            } else if(data.split('=')[1] === 'changeItem') {
                res.writeHead(302, {'Location': 'http://localhost:5050/changeItem.html'});
                res.end();
            } else if(data.split('=')[1] === 'deleteItem') {
                res.writeHead(302, {'Location': 'http://localhost:5050/deleteItem.html'});
                res.end();
            } else if(data.split('=')[1] === 'booking') {
                data2 = data2.slice(0, -1) + ' {Item {Id, Category, Name, Description, UnitPrice, AmInStock} AmRented, RentTime, StartTime, EndTime, RenterName, RenterSurname, RenterPhone, RenterCardDet} }';
                console.log(data2);
                graphql(schema, data2, root).then((response) => {
                    console.log("GRAPHQL response");
                    console.log(response);
                    console.log(response.data);
                    console.log(JSON.stringify(response.data));
                    res.write(JSON.stringify(response.data));
                    res.end();
                });
            } else {
                console.log('In else');
                console.log(data2);
                // if(data2 !== )
                graphql(schema, data2, root).then((response) => {
                    console.log("GRAPHQL response");
                    console.log(response);
                    console.log(response.data);
                    console.log(JSON.stringify(response.data));
                    res.write(JSON.stringify(response.data));
                    res.end();
                });
            }
        });
    }
    if (uri === '/entry.html') {
        fs.readFile(__dirname + uri, 'binary', (err, file) => {
            console.log('------------');
            console.log(err);
            console.log(file);
            console.log('------------');

            res.write(file)
        });
    }
    if (uri === '/booking.html') {
        fs.readFile(__dirname + uri, 'binary', (err, file) => {
            res.write(file)
        });
    }
    if (uri === '/addItem.html') {
        fs.readFile(__dirname + uri, 'binary', (err, file) => {
            res.write(file)
        });
    }
    if (uri === '/changeItem.html') {
        fs.readFile(__dirname + uri, 'binary', (err, file) => {
            res.write(file)
        });
    }
    if (uri === '/deleteItem.html') {
        fs.readFile(__dirname + uri, 'binary', (err, file) => {
            res.write(file)
        });
    }
    // console.log(req.)
}).listen(parseInt(port, 10));

// Run the GraphQL query '{ hello }' and print out the response
// graphql(schema, '{ hello }', root).then((response) => {
//     console.log(response);
// });
