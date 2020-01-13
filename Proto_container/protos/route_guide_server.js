//this is booking Server

'use strict';
console.log(__dirname);
// const services = require('./route_guide_grpc_pb');
const PROTO_PATH = __dirname + '/route_guide.proto';
console.log('PROTO PATH: ', PROTO_PATH);
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const crypto = require('crypto');
const fsM = require('./shared/fetcherMain.js');

// const serverAddress = '127.0.0.1:4250';
const serverAddress = 'proto:4250';

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
const routeguide = protoDescriptor.RouteGuide;

const book = (call, callback) => {
    console.log('HERE');
    console.log(call.request.data);
    const detailsArr = call.request.data.split('&');
    let details = {};
    detailsArr.forEach(det => {
        let data = det.split('=');
        details[data[0]] = data[1];
    });
    console.log(details);
    //base query details.id, callback as text, not {data: text}
    fsM.fetchPriceById(details.id, (err, res) => {
        if(!err) {
            details.price = res;
            details.now = new Date().toDateString();
            fsM.addBooking(details, (err, res) => {
                if(!err) {
                    callback('', {data: res});
                } else {
                    console.log('addBooking error, err: ', err);
                    callback(err, {data: ''});
                }
            });
        } else {
            console.log('fetchPriceById error, err: ', err);
            callback(err, {data: ''});
        }
    });

    // console.log(price);

    // return call;
};

const login = (call, callback) => {
    console.log('Login func on server');
    const detailsArr = call.request.data.split('&');
    let details = {};
    detailsArr.forEach(det => {
        let data = det.split('=');
        details[data[0]] = data[1];
    });
    const hash = crypto.createHash('sha256');
    hash.write(details.password + 'SecretSalt');
    hash.end();
    const password = hash.read().toString().replace(/'/g, "_");
    fsM.fetchUserByLogin(details.login, password, res => {
      // console.log('Found');
      console.log(res);
      if(res.length > 0) {
        //////////////////////////////////////////////GENERATE TOKEN
        callback('', {data: "User successfully logged in"});
      }
    })
};

const signup = (call, callback) => {
    const detailsArr = call.request.data.split('&');
    let details = {};
    detailsArr.forEach(det => {
        let data = det.split('=');
        details[data[0]] = data[1];
    });
    const hash = crypto.createHash('sha256');
    hash.write(details.password + 'SecretSalt');
    hash.end();
    const password = hash.read().toString().replace(/'/g, "_");
    fsM.addUser(details.login, password, 1, res => {
      if(res.length > 0) {
        //////////////////////////////////////////////GENERATE TOKEN
        callback('', {data: res});
      }
    });
};

const showbooking = (call, callback) => {
    fsM.fetchTableByValue(res => {
        console.log('IMPORTANT BIT');
        console.log(callback.toString());
        console.log(JSON.stringify(res));
        console.log(typeof JSON.stringify(res));
        callback('', {data: JSON.stringify(res)});
    });
    // callback('', {list: toRet});
};

const getServer = () => {
    const server = new grpc.Server();
    server.addService(routeguide.service , {
        book: book,
        showbooking: showbooking,
        login: login,
        signup: signup
    });
    server.bind(serverAddress, grpc.ServerCredentials.createInsecure());
    return server;
};

const server = getServer();
server.start();
console.log('Server running on', serverAddress);