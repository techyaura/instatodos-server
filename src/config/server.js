
require('./env');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const dbConnection = require('./db');
const { success, error, warning } = require('../utils/console-log');
const schema = require('../gql');
const winston = require('./winston');
const { AuthMiddleware } = require('../middlewares');
const errorHandler = require('../errors/handler');

class Boot {
  constructor() {
    this.app = app;
    this.port = process.env.PORT || 8080;
    this.environment = process.env.environment || 'local';
    this.boostrapExpress();
  }

  /**
   * @name boostrapExpress
   * @description Starting bootsrap server
   */
  async boostrapExpress() {
    try {
      await dbConnection();
      return Promise.all([
        this.useCors(),
        this.useMorgan(),
        this.useGraphQl(),
        this.useLogger(),
        this.useListen()
      ]).then(() => {
        if (process.env.NODE_ENV === 'development') {
          /** Clear console for every server restart while development */
          // console.clear(); // eslint-disable-line no-console
        }
        console.log(success(`Running a GraphQL API server on PORT: ${this.port} in ${this.environment} mode`)); // eslint-disable-line no-console
        return this.app;
      });
    } catch (err) {
      console.log(error('Unable to start GraphQL API server')); // eslint-disable-line no-console
      console.log(warning('---See Below for Error---')); // eslint-disable-line no-console
      console.log(error(err)); // eslint-disable-line no-console
      return err;
    }
  }

  /**
   * @name useCors
   * @description use CORS policy
   */
  useCors() {
    return this.app.use(cors());
  }

  /**
   * @name useMorgan
   * @description For logging
   */
  useMorgan() {
    return this.app.use(morgan('combined', { stream: winston.stream }));
  }

  /**
   * @name graphQlHttpConfig
   * @description Graphql config
   */
  static graphQlHttpConfig() {
    return graphqlHTTP((request, response) => ({
      schema,
      pretty: true,
      graphiql: process.env.NODE_ENV === 'development',
      context: { ...request, startTime: Date.now() },
      customFormatErrorFn: (err => errorHandler(err, request, response)),
      extensions: this.useExtensions()
    }));
  }

  /**
   * @name useGraphQl
   * @description configure express with gRaphql
   */
  useGraphQl() {
    return this.app.use('/graphql', AuthMiddleware.jwt, this.constructor.graphQlHttpConfig());
  }

  /**
   * @name useErrors
   * @description Express Global Error Handler
   */
  useLogger() {
    this.app.use((err, req, res, next) => errorHandler(err, req, res, next, true));
  }

  /**
   * @name useListen
   * @description Express expose port for server
   */
  useListen() {
    return this.app.listen(this.port);
  }

  static useExtensions() {
    return ({
      document, // eslint-disable-line no-unused-vars
      variables, // eslint-disable-line no-unused-vars
      operationName, // eslint-disable-line no-unused-vars
      result, // eslint-disable-line no-unused-vars
      context
    }) => ({
      runTime: Date.now() - context.startTime
    });
  }
}

module.exports = Boot;
