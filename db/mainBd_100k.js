'use strict';

const items = ["Bike", "Chair", "Table", "Tent"];
const features = ["Color", "Size", "Shape"];


let db = require('./db.js');

const basePool = {
  host: '127.0.0.1',
  port: '5432',
  database: 'architecture',
  user: 'postgres',
  password: 'password'
};

let base = new db(basePool);

for(let i = 0; i < 100000; ++i) {
  const item = items[Math.floor(Math.random() * items.length)];
  const feature = features[Math.floor(Math.random() * features.length)];
  const featureName = feature + i;
  const itemName = item + i;
  const totalAm = Math.floor((Math.random() * 50) + 20);
  const amInStock = totalAm - Math.floor((Math.random() * 15) + 1);

  // console.log(item, feature, featureName, itemName, totalAm,amInStock);
  let promise = new Promise((res,rej) => {
    base.insertIntoTable(
      'inventory',
      {CategoryId: `(select "Id" from categories where "Name" = '${item}')` ,
       Name: itemName,
       Description: `Description${i}`,
       UnitPrice: Math.round((Math.random() * 4000) + 500)},
      () => {res(1)}
    );
  })
  .then(() => {
    base.insertIntoTable(
      'inventory_features',
      {InventoryId: `(select "Id" from inventory where "Name" = '${itemName}')`,
       FeatureId: `(select "Id" from features where "Name" = '${feature}')` ,
       Description: featureName},
      () => {}
    );
  }, (err) => {console.log(err);}
  )
  .then(() => {
    base.insertIntoTable(
      'stock',
      {InventoryId: `(select "Id" from inventory where "Name" = '${itemName}')`,
       TotalAm: totalAm,
       AmInStock: amInStock},
      () => {}
    );
  }, (err) => {console.log(err);})

}

// base.close();
