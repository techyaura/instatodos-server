process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const fs = require('fs');

if (fs.existsSync(`.env.${process.env.NODE_ENV}`)) {
  // Config env variables on app bootsrap for DEV-SERVER
  const env = require('dotenv');
  env.config({
    path: `.env.${process.env.NODE_ENV}`
  });
}
