'use strict';

const DBResponse = require('./DBResponse.js');

class DBResponseBuilder {
  constructor(props = {
    Id: null,
    Category: null,
    Name: null,
    Description: null,
    UnitPrice: null,
    AmInStock: null
  }) {
    this.item = new DBResponse(props);
  }
  setId(Id) {
    this.item.Id = Id;
    return this;
  }
  setCategory(Category) {
    this.item.Category = Category;
    return this;
  }
  setName(Name) {
    this.item.Name = Name;
    return this;
  }
  setDescription(Description) {
    this.item.Description = Description;
    return this;
  }
  setUnitPrice(UnitPrice) {
    this.item.UnitPrice = UnitPrice;
    return this;
  }
  setAmInStock(AmInStock) {
    this.item.AmInStock = AmInStock;
    return this;
  }
  build() {return this.item}
}

module.exports = DBResponseBuilder;
