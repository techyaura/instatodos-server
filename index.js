// Config env constibales on app bootsrap
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Express config
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const morgan = require('morgan');

const port = process.env.PORT;

// connect to the database
require('./src/config/db');

const winston = require('./src/config/winston');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  
type User {
  name: String,
  amount: Int
}

type Query {
    hello: User
}

`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => ({ name: 'hwllo', amount: 300 }),
};

const app = express();
app.use(morgan('combined', { stream: winston.stream }));
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
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
