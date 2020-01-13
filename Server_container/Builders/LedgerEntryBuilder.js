'use strict';

const LedgerEntry = require('./LedgerEntry.js');

class LedgerEntryBuilder {
  constructor(props = {
    // id: null,
    AmRented: null,
    StartTime: null,
    EndTime: null,
    Price: null,
    RenterName: null,
    RenterSurname: null,
    RenterPhone: null,
    RenterCardDet: null
  }) {
    this.item = new LedgerEntry(props);
  }
  // setId(id) {this.item.id = id}
  setAmountRented(amountRented) {
    this.item.AmRented = amountRented;
    return this;
  }
  setStartTime(startTime) {
    this.item.StartTime = startTime;
    return this;
  }
  setEndTime(endTime) {
    this.item.EndTime = endTime;
    return this;
  }
  setPrice(price) {
    this.item.Price = price;
    return this;
  }
  setRenterName(renterName) {
    this.item.RenterName = renterName;
    return this;
  }
  setRenterSurname(renterSurname) {
    this.item.RenterSurname = renterSurname;
    return this;
  }
  setRenterPhone(renterPhone) {
    this.item.RenterPhone = renterPhone;
    return this;
  }
  setRenterCardDetails(renterCardDetails) {
    this.item.RenterCardDet = renterCardDetails;
    return this;
  }
  build() {return this.item}
}

module.exports = LedgerEntryBuilder;
