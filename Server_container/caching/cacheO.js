'use strict';

const main = require('../shared/fetcherMain.js');
const f1 = require('../fetchers/fetcherSupplier1.js');
const f2 = require('../fetchers/fetcherSupplier2.js');
let DBResponseBuilder = require('../Builders/DBResponseBuilder.js');

// let s1Inv = [];
// let s2Inv = [];

let cache = {
  mainInv: [],
  s1Inv: [],
  s2Inv: [],
};

const makeCache = (callback) => {
  let mainInvP = new Promise((res, rej) => {
    getMainCache((status) => res(status));
  });
  let s1InvP = new Promise((res, rej) => {
    getSupplier1Cache((status) => res(status));
  });
  let s2InvP = new Promise((res, rej) => {
    getSupplier2Cache((status) => res(status));
  });
  Promise.all([mainInvP, s1InvP, s2InvP]).then(() => {
    callback(!cache.emptyCache() ? JSON.stringify("Successful caching"): JSON.stringify("Partial caching"))
  });
  // Promise.all([s1P, s2P]).then(() => {callback(s1Inv); callback(s2Inv)});
};

const emptyCache = () => {
    return cache.cache.mainInv.length > 0 &&
    cache.cache.s1Inv.length > 0 &&
    cache.cache.s2Inv.length > 0

    // cache.cache.s1Inv.length === 0 &&
    // cache.cache.s2Inv.length === 0 ? [1, 2]:

    // cache.cache.s2Inv.length === 0 ? [2]:

    // cache.cache.s1Inv.length === 0 ? [1]:
    // [1,2,3]
}

const dropCache = (callback) => {
  cache.mainInv = [];
  cache.s1Inv = [];
  cache.s2Inv = [];
  callback();
};

const expireCacheEntries = (callback) => {
};

const getMainCache = (callback) => {
  main.fetchInventory((res) => {
    cache.mainInv = res;
    callback(1);
  })
};

const getSupplier1Cache = (callback) => {
   f1.fetchInventory((res) => {
    console.log(`----------------------- ${res}`);
    cache.s1Inv = res;
    callback(1);
  });
};

const getSupplier2Cache = (callback) => {
  // let stop = 0;
  let pagesP = new Promise( (res, rej) => {
     f2.fetchTableLength((length) => {
      if(length === []) res([])
      const pages = Math.ceil(length/5000);
      res(pages);
    });
  }).then((pages) => {
    if(pages === []) res(0)
    let promises = [];//[new Promise((res, rej) => setTimeout(() => res(1), 1000))];
    for (let i = 1;i < pages; i++) {
      promises.push(new Promise((res, rej) => {
         f2.fetchInventoryPage(i, (result) => {
            cache.s2Inv = cache.s2Inv.concat(result);
            res(1);
        });
      }));

    }
    Promise.all(promises).then(() => callback(1));
  });
};

const getQueryById = (cacheId, id, callback) => {//cacheId - 0 for main, >0 === suplier Number
  if(cacheId === 0) {
    const result = cache.mainInv.filter((obj) => obj.Id === id);
    return callback(result);
  } else if(cacheId === 1) {
    const result = cache.s1Inv.filter((obj) => obj.Id === id);
    return callback(result);
  } else if(cacheId === 2) {
    const result = cache.s2Inv.filter((obj) => obj.Id === id);
    return callback(result);
  }
};

const getPriceList = (callback) => {
  let res = cache.s2Inv.map(obj => {
    return obj = new 
        DBResponseBuilder()
        .setId(obj.Id)
        .setCategory(null)
        .setName(obj.Name)
        .setDescription(null)
        .setUnitPrice(obj.UnitPrice)
        .setAmInStock(null)
        .build();
  });
  // console.log(res);
  return callback(res);
};

const getDetails = (id, callback) => {
  let res = cache.s2Inv.filter(el => el.Id === id).map(obj => {
      return obj = new 
      DBResponseBuilder()
        .setId(obj.Id)
        .setCategory(null)
        .setName(obj.Name)
        .setDescription(obj.Description)
        .setUnitPrice(null)
        .setAmInStock(null)
        .build();
  });
  console.log(res);
  return callback(res);
};

const getQueryByCategory = (categoryName, callback) => {
  let res = cache.s1Inv.filter(el => {
    console.log(el.Category, categoryName);
    return el.Category === categoryName
  });
  console.log(res);
  return callback(res);
};

module.exports = {
  cache,
  dropCache,
  expireCacheEntries,
  makeCache,
  getQueryById,
  getPriceList,
  getDetails,
  getQueryByCategory,
  emptyCache
};
