/* eslint-disable no-console */

require('./env');
const express = require('express');
const cluster = require('cluster');
const bodyParser = require('body-parser');
const cCPUs = require('os').cpus().length;
const graphqlHTTP = require('express-graphql');
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
        this.boostrapExpress();
      }
    } else {
      this.boostrapExpress();
    }
  }

  /**
   * @name boostrapExpress
   * @description Starting bootsrap server
   */
  async boostrapExpress() {
    try {
      await dbConnection();
      return Promise.all([
        // this.useCors(),
        this.useMorgan(),
        this.useGraphQl(),
        this.useLogger()
        // this.useListen()
      ]).then(() => {
        if (process.env.NODE_ENV === 'development') {
          /** Clear console for every server restart while development */
          // console.clear(); // eslint-disable-line no-console
        }
        // success(`🚀 Running GraphQL server at http://${this.host}:${this.port} in ${process.env.NODE_ENV} mode`); // eslint-disable-line no-console
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
    return graphqlHTTP((request, response, next) => ({
      schema,
      pretty: true,
      graphiql: process.env.NODE_ENV === 'development',
      context: { ...request, startTime: Date.now() },
      customFormatErrorFn: (err => errorHandler(err, request, response, next)),
      extensions: process.env.NODE_ENV === 'development' ? this.useExtensions() : ''
    }));
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
      context: ({ req }) => ({ ...req, startTime: Date.now() }),
      // engine: {
      //   rewriteError: ((err, request, response) => errorHandler(err, request, response))
      // },
      formatError: (err) => {
        const formatError = errorHandler(err);
        console.log(err);
        // winston.error(`${response.status || 500} - ${response.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return formatError;
      },
      // engine: {
      //   rewriteError: (err) => {
      //     console.log(err);
      //   }
      // },
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
    app.use('/graphql',
      // graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
      AuthMiddleware.jwt);
    server.applyMiddleware({ app });
    httpServer.listen(this.port, () => {
      console.log(success(`🚀 Server ready at http://localhost:${this.port}${server.graphqlPath}`));
      console.log(success(`🚀 Subscriptions ready at ws://localhost:${this.port}${server.subscriptionsPath}`));
    });
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
