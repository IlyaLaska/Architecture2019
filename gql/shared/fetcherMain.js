'use strict';

let db = require('./db.js');
let DBResponseBuilder = require('./DBResponseBuilder.js');

const basePool = {
    host: '127.0.0.1',
    // host: 'db',
    port: '5432',
    database: 'architecture',
    user: 'postgres',
    // password: ''
    password: 'password'
};

let base = new db(basePool);

const addItem = (newItem, callback) => {
    console.log('-------------------------------------------');
    console.log(newItem);
    console.log('-------------------------------------------');
    base.query(`insert into items (Id, Name, Description, UnitPrice, AmInStock) VALUES
(${newItem.Id}, ${newItem.Name}, ${newItem.Description}, ${newItem.UnitPrice}, ${newItem.AmInStock})`, res => {
        console.log(res);
        callback(res);
    })};

const changeItem = (id, newItem, callback) => {
    base.query(`delete from items where Id = ${item.Id};insert into items (Id, Name, Description, UnitPrice, AmInStock) VALUES
(${newItem.Id}, ${newItem.Name}, ${newItem.Description}, ${newItem.UnitPrice}, ${newItem.AmInStock})`, res => {
        console.log(res);
        callback(res);
    })
};

const deleteItem = (item, callback) => {
  base.query(`delete from items where Id = ${item.Id}`, res => {
      console.log(res);
      callback(res);
  })
};

const addBooking = (details, callback) => {//callback(err, res)
    base.query(`insert into accounting
    ("InventoryId", "AmRented", "RentTime", "StartTime", "EndTime", "Price", "RenterName", "RenterSurname", "RenterPhone", "RenterCardDet")
    values ('${details.id}', '${details.amount}', '${details.rentTime}', '${details.now}', '${details.now}', '${details.price}',
    '${details.name}', '${details.surname}', '${details.phone}', '${details.card}')`, (err, res) => {
        // console.log('INSANS::');
        // console.log(insAns);
        // console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR::');
        // console.log(insAnsErr);
        // console.log(callback.toString());
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log(err);
        console.log(res);
        if(err) {
            callback('', 'Inserted successfully');
        } else {
            callback('Error inserting booking data');
        }
    });
};

const fetchBookings = (callback) => {
    base.query(`select * from accounting`, (res) => {
        // console.log(err);
        console.log(res);
        return callback(res);
    });
};

const fetchPriceById = (id, callback) => {//callback(err, res)
    base.query(`select * from inventory where "Id" = ${id}`, (res) => {
        // console.log(resErr);
        console.log(res);
        // let price =  0;
        // {
        //     Id: 1,
        //         CategoryId: 1,
        //     Name: 'BikeW8',
        //     Description: 'Great deal',
        //     UnitPrice: 2600
        // }
        // price = 1000;
        if (res.length === 0) {
            callback('Item does not exist');
        } else {
            callback('', res[0].UnitPrice)
            // price = res.rows[0].UnitPrice;
        }
    });
};

const fetchUserByLogin = (login, password, callback) => {
    return base.query(`select *
    from users
    where "Login" = '${login}'`,
        (res) => {
            let response = res.filter(obj => {
                console.log(obj.Password);
                console.log(password);
                return obj.Password === password;
                console.log(obj.Password === password);
            });
            // console.log(response);
            return callback(response);
        });
};

const fetchUsers = (callback) => {
    return base.query(`select *
    from users`,
        (res) => {
        console.log(res);
            // let response = res.filter(obj => {
            //     console.log(obj.Password);
            //     console.log(password);
            //     return obj.Password === password;
            //     console.log(obj.Password === password);
            // });
            // console.log(response);
            return callback(res);
        });
};

const addUser = (login, password, privileges, callback) => {
    console.log('IN ADDUSER');
    console.log(login);
    console.log(password);
    console.log(privileges);

    return base.query(`insert into users
    ("Login", "Password", "Privileges") VALUES 
    ('${login}', '${password}', '${privileges}');`,
        (res) => {
            return callback('Successfully  added  a User');
        });
};

const fetchInventory = (callback) => {
    return base.query(`select distinct i."Id", i."Name", i."Description", i."UnitPrice",\
    s."AmInStock" from inventory i left join inventory_features if on i."Id" = if."InventoryId"\
    join stock s on i."Id" = s."InventoryId"`,
        (res) => {
            const response = res.map(obj => {
                return obj = new
                DBResponseBuilder()
                    .setId(obj.Id)
                    .setCategory(null)
                    .setName(obj.Name)
                    .setDescription(obj.Description)
                    .setUnitPrice(obj.UnitPrice)
                    .setAmInStock(obj.AmInStock)
                    .build();
            });
            return callback(response);
        });
};

const fetchQueryByFeatureValue = (value, callback) => {
    return base.query(`select distinct i."Id", i."Name", i."Description", i."UnitPrice",\
    s."AmInStock" from inventory i left join inventory_features if on i."Id" = if."InventoryId"\
    join stock s on i."Id" = s."InventoryId"\
    where if."Description" = '${value}'`,
        (res) => {
            const response = res.map(obj => {
                return obj = new
                DBResponseBuilder()
                    .setId(obj.Id)
                    .setCategory(null)
                    .setName(obj.Name)
                    .setDescription(obj.Description)
                    .setUnitPrice(obj.UnitPrice)
                    .setAmInStock(obj.AmInStock)
                    .build();
            });
            return callback(response);
        });
};

const fetchQueryByCategory = (value, callback) => {
    return base.query(`select distinct i."Id", i."Name", i."Description", i."UnitPrice"\
    s."AmInStock", c."Name" as "Category" from inventory i join categories c on i."CategoryId" = c."Id"\
    join stock s on i."Id" = s."InventoryId"\
    where c."Name" = '${value}'`,
        (res) => {
            const response = res.map(obj => {
                return obj = new
                DBResponseBuilder()
                    .setId(obj.Id)
                    .setCategory(obj.Category)
                    .setName(obj.Name)
                    .setDescription(obj.Description)
                    .setUnitPrice(obj.UnitPrice)
                    .setAmInStock(obj.AmInStock)
                    .build();
            });
            return callback(response);
        });
};

const fetchQueryById = (value, callback) => {
    return base.query(`select distinct i."Id", i."Name", i."Description", i."UnitPrice",\
    s."AmInStock", c."Name" as "Category" from inventory i join categories c on i."CategoryId" = c."Id"\
    left join stock s on i."Id" = s."InventoryId"\
    where i."Id" = ${value}`,
        (res) => {
            const response = res.map(obj => {
                return obj = new
                DBResponseBuilder()
                    .setId(obj.Id)
                    .setCategory(obj.Category)
                    .setName(obj.Name)
                    .setDescription(obj.Description)
                    .setUnitPrice(obj.UnitPrice)
                    .setAmInStock(obj.AmInStock)
                    .build();
            });
            return callback(response);
        });
};

const fetchTableByValue = (callback) => {
    let date = new Date();
    let now = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    base.getTableByValue('accounting', 'EndTime', ">" + now, (result) => {
        return callback(result);
        // res.write(JSON.stringify('Unreturned Items:\n'));
    });
};


// fetchQueryByFeatureValue('Brown', (result) => console.table(result));
// fetchQueryByCategory('Tent', (result) => console.table(result));

module.exports = {
    addItem,
    changeItem,
    deleteItem,
    addBooking,
    fetchBookings,
    fetchPriceById,
    fetchUserByLogin,
    fetchUsers,
    addUser,
    fetchInventory,
    fetchQueryByCategory,
    fetchQueryByFeatureValue,
    fetchQueryById,
    fetchTableByValue
};
