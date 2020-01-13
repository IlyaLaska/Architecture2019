'use strict';

class LedgerEntry {
  constructor(props = {
    id: null,
    amountRented: null,
    startTime: null,
    endTime: null,
    price: null,
    renterName: null,
    renterSurname: null,
    renterPhone: null,
    renterCardDetails: null
  }) {
    for(let prop in props) this[prop] = props[prop];
  }
}

module.exports = LedgerEntry;
