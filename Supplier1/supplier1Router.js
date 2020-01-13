'use strict';

let s1API = require('./supplier1API.js');

let route = (uri, callback) => {
  console.log(uri);
  if(uri === '/getInventory'){
    s1API.getInventory((result) => {
      // console.log('Done');
      // res.write(JSON.stringify('Unreturned Items:\n'));
      callback(result);
    }); 
  };

  if(uri.match(/\/getPriceById:\d+/)){
    const id = +uri.match(/\d+/)[0];
    s1API.getQueryById(id, (result) => {
      callback(result);
    });
  };

  if(uri.match(/\/search\?query='.+'/)){ //search?query='category=Tent'
    let query = uri.match(/\'.+\'/)[0];
    const search = query.slice(1, -1).split('=');
    if(search[0] === 'category'){
      const categoryName = search[1];
      s1API.getQueryByCategory(categoryName, (result) => {
        callback(result);
      });
    }
    if(search[0] === 'feature'){
      const featureName = search[1];
      s1API.getQueryByFeatureValue(featureName, (result) => {
        callback(result);
      });
    } 
  };
}

module.exports = {route};
