process.env.NODE_ENV = 'test';
const supertest = require('supertest');

let request;
exports.mochaHooks = {
  beforeEach(done) {
    // global setup for all tests
    const app = require('../index');
    request = supertest(app);
    done();
  },
  afterAll() {
    // one-time final cleanup
  }
};
