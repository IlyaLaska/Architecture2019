'use strict';

class AndSpecification {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  isSatisfiedBy(smth) {
    return this.a.isSatisfiedBy(smth) && this.b.isSatisfiedBy(smth);
  }
}

class OrSpecification {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  isSatisfiedBy(smth) {
    return this.a.isSatisfiedBy(smth) || this.b.isSatisfiedBy(smth);
  }
}

class NotSpecification {
  constructor(a) {
    this.a = a;
  }
  isSatisfiedBy(smth) {
    return !this.a.isSatisfiedBy(smth);
  }
}

class Specification {
  constructor(a) {
    this.a = a;
  }
  and(b) {
    return new AndSpecification(this, b);
  }
  or(b) {
    return new OrSpecification(this, b);
  }
  not() {
    return new NotSpecification(this);
  }
}

module.exports = Specification;
