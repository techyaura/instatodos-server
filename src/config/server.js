// Config env constibales on app bootsrap
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

const express = require('express');

const app = express();
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');
const { success, error, warning } = require('../utils/console-log');
const schema = require('../gql');
const winston = require('./winston');
const { AuthMiddleware } = require('../middlewares');

class Boot {
  constructor(db) {
    this.dbConnection = db;
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
      await this.dbConnection();
      return Promise.all([
        this.useCors(),
        this.useMorgan(),
        this.useGraphQl(),
        this.useErrors(),
        this.useListen()
      ]).then(() => {
        if (process.env.NODE_ENV === 'development') {
          /** Clear console for every server restart while development */
          console.clear(); // eslint-disable-line no-console
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
    return graphqlHTTP({
      schema,
      pretty: true,
      graphiql: true
    });
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
  useErrors() {
    return this.app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      // add this line to include winston logging
      this.winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      const errorHandler = require('../errors/handler');
      return errorHandler({
        err, req, res, next
      });
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

module.exports = Boot;
