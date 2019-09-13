// Config env variables on app bootsrap
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const env = require('dotenv');

env.config({
  path: `.env.${process.env.NODE_ENV}`
});
