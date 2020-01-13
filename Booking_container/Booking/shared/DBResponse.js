'use strict';

class DBResponse {
  constructor(props = {
    Id: null,
    Category: null,
    Name: null,
    Description: null,
    UnitPrice: null,
    AmInSotck: null
  }) {
    for(let prop in props) this[prop] = props[prop];
  }
}

module.exports = DBResponse;
