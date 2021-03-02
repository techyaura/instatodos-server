process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const fs = require('fs');
const path = require('path');

if (fs.existsSync(`.env.${process.env.NODE_ENV}`)) {
  // Config env variables on app bootsrap for DEV-SERVER
  const filePath = path.resolve(__dirname, '../../', `.env.${process.env.NODE_ENV}`);
  require('dotenv').config({ path: filePath });
}
