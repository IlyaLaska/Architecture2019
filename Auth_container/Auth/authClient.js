//this is auth client

'use strict';

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

// const serverAddress = '127.0.0.1:4250';
const serverAddress = 'proto:4250';

const proto = grpc.loadPackageDefinition(
    protoLoader.loadSync( __dirname + '/route_guide.proto', {
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

const login = (call,  callback) => {
        // console.log("In l function");
        // console.log(callback.toString());
        // console.log(proto);
        // console.log(client);
        console.log('Login func Client');
        console.log(call);
        client.login(call, (err, resp) => {
                // console.log("Inside book");
                console.log(err);
                console.log(resp);
                callback(resp.data);
        });
};

const signup = (call,  callback) => {
        client.signup(call, (err, resp) => {
                callback(resp.data);
        });
};

module.exports = {
        login,
        signup
};