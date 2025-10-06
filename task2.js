"use strict";

const myFunction = (num) => ++num;

const a = 5;
const b = myFunction(a);
console.dir({ a, b });

module.exports = { myFunction };