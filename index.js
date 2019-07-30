// Config env constibales on app bootsrap
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

// Express config
const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const schema = require('./src/graphql');

const port = process.env.PORT || 8080;

// connect to the database
require('./src/config/db');

const winston = require('./src/config/winston');

const { AuthMiddleware } = require('./src/middlewares');

const app = express();
app.use(morgan('combined', { stream: winston.stream }));
app.use('/graphql', AuthMiddleware.jwt, graphqlHTTP({
  schema,
  pretty: true,
  graphiql: true
}));

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port);

// custom console
console.log(`Running a GraphQL API server at localhost:${port}/graphql`); // eslint-disable-line no-console
