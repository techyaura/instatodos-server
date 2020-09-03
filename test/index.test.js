const testCase = require('mocha').describe;
const pre = require('mocha').before;
const assertions = require('mocha').it;
const { assert } = require('chai');

testCase('Array', () => {
  pre(() => {
    // ...
  });

  testCase('#indexOf()', () => {
    assertions('should return -1 when not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
