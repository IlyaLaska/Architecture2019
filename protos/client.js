//this is booking client

'use strict';

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const serverAddress = '127.0.0.1:4250';

const proto = grpc.loadPackageDefinition(
    protoLoader.loadSync( __dirname + '\\route_guide.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const client = new proto.RouteGuide(
    serverAddress,
    grpc.credentials.createInsecure()
);

const book = (call,  callback) => {
        // console.log("In t function");
        // console.log(callback.toString());
        // console.log(proto);
        // console.log(client);
        client.book(call, (err, resp) => {
                // console.log("Inside book");
                // console.log(resp);
                // console.log(err);
                callback(resp.data);
        });
        // callback(JSON.stringify("Booked   successfully"));
};

const login = (call,  callback) => {
        // console.log("In l function");
        // console.log(callback.toString());
        // console.log(proto);
        // console.log(client);
        client.login(call, (err, resp) => {
                // console.log("Inside book");
                // console.log(resp);
                // console.log(err);
                callback(resp.data);
        });
};

const signup = (call,  callback) => {
        client.signup(call, (err, resp) => {
                callback(resp.data);
        });
};

const showbooking = (callback) => {
        console.log('In Client showbooking');
        client.showbooking({}, (err, resp) => {
                console.log('Inside 2X');
                callback(resp.data);
        });
};

module.exports = {
        book,
        showbooking,
        login,
        signup
};