'use strict';

const myFunction = () => {
  console.log({ a });
  var a = 5;
  console.log({ a });
};

myFunction();

module.exports = { myFunction };