'use strict';

const Specification = require('./Specification.js');

class PriceListNumIdCheck extends Specification {
  constructor() {
    super();
  }
  isSatisfiedBy(id) {
    return Number.isInteger(id);
  }
}

class PriceListValidIdCheck extends Specification {
  constructor() {
    super();
  }
  isSatisfiedBy(id) {
    return id > 0;
  }
}

const PriceListIdCheck = new PriceListNumIdCheck().and(new PriceListValidIdCheck());

module.exports = PriceListIdCheck;
