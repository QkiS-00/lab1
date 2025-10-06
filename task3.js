"use strict";

const myFunction = (obj) => {
  if (typeof obj === "object") {
    obj.n++;
  }
};

const obj = { n: 5 };
myFunction(obj);
console.dir(obj);

module.exports = { myFunction }