'use strict';

class RentalItem {
  constructor(props = {
    name: null,
    description: null,
    totalAmount: null,
    pricePerH: null
  }) {
    for(let prop in props) this[prop] = props[prop];
  }
}

module.exports = RentalItem;
