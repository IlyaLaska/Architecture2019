'use strict';

const fs = require('fs');
const cli = require("./bookingClient.js");
// const crypto = require('crypto');

const fsM = require('./shared/fetcherMain.js');


const route = (data, uri, callback) => {
  if(uri === '/book') {
    console.log('URI == BOOK');
    // console.log(cli);
    // console.log(data);
    // console.log(callback.toString());
    cli.book({data: data}, callback);
  //   //TODO ask DB to decrement and increment needed things in callback call callback
  }
  else if(uri === '/showbooking') {
    console.log('URI == SHOWBOOKING');
    cli.showbooking(callback);

  }

  else if(uri === '/booking.html') {
    fs.readFile('.'+uri, 'binary', (err, file) => callback(file));
  }
  else if(uri === '/bookingselect.html') {
    fs.readFile('.'+uri, 'binary', (err, file) => callback(file));
  }

  else callback('Error 404, page not found');

};

module.exports = {route};
