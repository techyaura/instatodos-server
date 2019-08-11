// Config env constibales on app bootsrap
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

// Express config
const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');

// 1. Use of graphql-tools for writing GraphQL Schema (RECOMMENDED)
// const schema1 = require('./src/graphql');

// 2. buildSchema over GraphQLSchema
const schema2 = require('./src/gql');


const port = process.env.PORT || 8080;

// connect to the database
require('./src/config/db');

const winston = require('./src/config/winston');


const { AuthMiddleware } = require('./src/middlewares');

const errorHandler = require('./src/errors/handler');

const app = express();

// Configuring CORS
app.use(cors());

app.use(morgan('combined', { stream: winston.stream }));
app.use('/graphql', AuthMiddleware.jwt, graphqlHTTP({
  schema: schema2,
  pretty: true,
  graphiql: true
}));

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  return errorHandler(err, req, res, next);
});


app.listen(port);

// custom console
console.log(`Running a GraphQL API server at localhost:${port}/graphql`); // eslint-disable-line no-console
