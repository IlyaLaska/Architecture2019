'use strict';

let http = require('http');

const req = require('../fetchers/requestMaker.js');

// req.makeRequest(4242, '/search?query=\'category=Tent\'', (res) => {
//   console.log('~~~~~~~~REQUEST 1~~~~~~~~');
//   console.table(res);
// });

// req.makeRequest(4242, '/getPriceById:1', (res) => {
//   console.log('~~~~~~~~REQUEST 2~~~~~~~~');
//   console.table(res);
// });

// req.makeRequest(4242, '/unretItems', (res) => {
//   console.log('~~~~~~~~REQUEST 3~~~~~~~~');
//   console.table(res);
// });

// req.makeRequest(4242, '/price-list', (res) => {
//   console.log('~~~~~~~~REQUEST 4~~~~~~~~');
//   console.table(res);
// });

req.makeRequest(4242, '/getInventory', (res) => {
  console.log('~~~~~~~~REQUEST 5~~~~~~~~');
  console.table(res);
});

// get('127.0.0.1:4242/cache');
