'use strict';

const RentalItem = require('./RentalItem.js');

class RentalItemBuilder {
  constructor(props = {
    Name: null,
    Description: null,
    TotalAmount: null,
    PricePerH: null
  }) {
    this.item = new RentalItem(props);
  }
  setName(name) {
    this.item.Name = name;
    return this;
  }

  setDescription(description) {
    this.item.Description = description;
    return this;
  }

  setAmount(amount) {
    this.item.Amount = amount;
    return this;
  }

  setPrice(price) {
    this.item.Price = price;
    return this;
  }
  
  build() {return this.item}
}

module.exports = RentalItemBuilder;
