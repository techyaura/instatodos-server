/* eslint-disable no-console */

const express = require('express');
const cluster = require('cluster');
const bodyParser = require('body-parser');
const cCPUs = require('os').cpus().length;
const { ApolloServer } = require('apollo-server-express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');

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
    this.host = process.env.HOST || '0.0.0.0';
    this.port = process.env.PORT || 8080;
    this.environment = process.env.environment;
    this.init();
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

  // /**
  //  * @name useErrors
  //  * @description Express Global Error Handler
  //  */
  // useLogger() {
  //   return this.app.use((err, req, res, next) => errorHandler(err, req, res, next, true));
  // }

  /**
   * @name useListen
   * @description Express expose port for server
   */
  useListen() {
    return this.app.listen(this.port);
  }

  /**
   * @name useGraphQl
   * @description configure express with gRaphql
   */
  // eslint-disable-next-line class-methods-use-this
  useGraphQl() {
    const server = new ApolloServer({
      schema,
      debug: process.env.NODE_ENV === 'development',
      context: async ({ req }) => {
        const user = await AuthMiddleware.jwt(req);
        return {
          ...req, user
        };
      },
      // engine: {
      //   rewriteError: ((err) => {
      //     console.log();
      //     return errorHandler(err);
      //   })
      // },
      formatError: (err) => {
        const formatError = errorHandler(err);
        winston.error(`${err.message} - ${err.name}`);
        return formatError;
      },
      subscriptions: {
        onConnect: () => {
          console.log('Connected');
        },
        onDisconnect: () => {
          console.log('DISCONNECTED');
        }
      }
    });
    app.use(express.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());
    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    const path = '/graphql';
    server.applyMiddleware({ app, path });
    httpServer.listen(this.port, () => {
      console.log(
        '🚀🐙',
        success(`Server ready at http://localhost:${this.port}${server.graphqlPath}`)
      );
      console.log(
        '🚀🔥',
        success(`Subscriptions ready at ws://localhost:${this.port}${server.subscriptionsPath}`)
      );
    });
  }

  /**
   * @name boostrapExpress
   * @description Starting bootsrap server
   */
  async boostrapExpress() {
    try {
      await dbConnection();
      this.useMorgan();
      this.useGraphQl();
      // this.useLogger();
      if (process.env.NODE_ENV === 'development') {
        /** Clear console for every server restart while development */
        console.clear(); // eslint-disable-line no-console
      }
      return this.app;
    } catch (err) {
      console.log(error('Unable to start GraphQL API server')); // eslint-disable-line no-console
      console.log(warning('---See Below for Error---')); // eslint-disable-line no-console
      console.log(error(err)); // eslint-disable-line no-console
      return err;
    }
  }

  init() {
    /** Check if clustering enabled */
    if (process.env.IS_CLUSTER_ENABLED) {
      if (cluster.isMaster) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < cCPUs; i++) {
          cluster.fork();
        }

        cluster.on('online', (worker) => {
          // eslint-disable-next-line no-console
          success(`Worker ${worker.process.pid} is online.`);
        });
        cluster.on('exit', (worker) => {
          // eslint-disable-next-line no-console
          error(`worker ${worker.process.pid} died.`);
        });
      } else {
        return this.boostrapExpress();
      }
    }
    return this.boostrapExpress();
  }
}

module.exports = Boot;
