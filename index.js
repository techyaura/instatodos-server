// Config env constibales on app bootsrap
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

class Boot {
  constructor(dbConnection, app, cors, morgan, winston, schema, graphqlHTTP, AuthMiddleware) {
    this.dbConnection = dbConnection;
    this.app = app;
    this.cors = cors;
    this.port = process.env.PORT || 8080;
    this.morgan = morgan;
    this.winston = winston;
    this.schema = schema;
    this.graphqlHTTP = graphqlHTTP;
    this.AuthMiddleware = AuthMiddleware;
    this.boostrapExpress();
  }

  /**
   * @name boostrapExpress
   * @description Starting bootsrap server
   */
  async boostrapExpress() {
    try {
      await this.dbConnection();
      return Promise.all([
        this.useCors(),
        this.useMorgan(),
        this.useGraphQl(),
        this.useErrors(),
        this.useListen()
      ]).then(() => {
        console.log(`Running a GraphQL API server at localhost:${this.port}/graphql`); // eslint-disable-line no-console
        return this.app;
      });
    } catch (err) {
      console.log('Unable to start GraphQL API server'); // eslint-disable-line no-console
      return err;
    }
  }

  /**
   * @name useCors
   * @description use CORS policy
   */
  useCors() {
    return this.app.use(this.cors());
  }

  /**
   * @name useMorgan
   * @description For logging
   */
  useMorgan() {
    return this.app.use(this.morgan('combined', { stream: this.winston.stream }));
  }

  /**
   * @name graphQlHttpConfig
   * @description Graphql config
   */
  graphQlHttpConfig() {
    return this.graphqlHTTP({
      schema: this.schema,
      pretty: true,
      graphiql: true
    });
  }

  /**
   * @name useGraphQl
   * @description configure express with gRaphql
   */
  useGraphQl() {
    return this.app.use('/graphql', this.AuthMiddleware.jwt, this.graphQlHttpConfig());
  }

  /**
   * @name useErrors
   * @description Express Global Error Handler
   */
  useErrors() {
    return this.app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      // add this line to include winston logging
      this.winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      const errorHandler = require('./src/errors/handler');
      return errorHandler(err, req, res, next);
    });
  }

  /**
   * @name useListen
   * @description Express expose port for server
   */
  useListen() {
    return this.app.listen(this.port);
  }
}

const express = require('express');

const app = express();
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');
const dbConnection = require('./src/config/db');
const schema = require('./src/gql');
const winston = require('./src/config/winston');
const { AuthMiddleware } = require('./src/middlewares');

const boot = new Boot(dbConnection, app, cors, morgan, winston, schema, graphqlHTTP, AuthMiddleware);
module.exports = boot;
