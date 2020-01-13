'use strict';

const items = ["Bike", "Skies"];


let db = require('./db.js');

const supplier2Pool = {
  host: '127.0.0.1',
  port: '5432',
  database: 'supply2',
  user: 'supplier2',
  password: 'password'
};

let base = new db(supplier2Pool);

for(let i = 0; i < 50000; ++i) {
  const item = items[Math.floor(Math.random() * items.length)];
  const itemName = item + i;
  const totalAm = Math.floor((Math.random() * 50) + 20);
  const amInStock = totalAm - Math.floor((Math.random() * 15) + 1);

  // console.log(item, feature, featureName, itemName, totalAm,amInStock);
  let promise = new Promise((res,rej) => {
    base.insertIntoTable(
      'price_list',
      {Name: itemName,
       Price: Math.round((Math.random() * 4000) + 500)},
      () => {res(1)}
    );
  })
  .then(() => {
    base.insertIntoTable(
      'details',
      {PriceListId: `(select "Id" from price_list where "Name" = '${itemName}')`,
       Description: itemName},
      () => {}
    );
  }, (err) => {console.log(err);}
  )
  .then(() => {
    base.insertIntoTable(
      'stock',
      {PriceListId: `(select "Id" from price_list where "Name" = '${itemName}')`,
       TotalAmount: totalAm,
       AmountInStock: amInStock},
      () => {}
    );
  }, (err) => {console.log(err);})

}

// base.close();
