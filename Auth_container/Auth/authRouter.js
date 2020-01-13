'use strict';

const fs = require('fs');

const cli = require("./authClient.js");
const fsM = require('./shared/fetcherMain.js');


const route = (data, uri, callback) => {
  console.log(uri);
  if(uri === '/login') {
    console.log('URI === login');
    cli.login({data: data}, callback);
  }
  if(uri === '/signup') {//add admins? WTF does tttt tttt on signup crash everything?????
    cli.signup({data: data}, callback);
    //privileges: 1 - User, 2- Admin
  }
  if(uri === '/signup.html') {
    fs.readFile('.'+uri, 'binary', (err, file) => callback(file));
  }
  if(uri === '/login.html') {
    fs.readFile('.'+uri, 'binary', (err, file) => callback(file));
  }

};

module.exports = {route};
