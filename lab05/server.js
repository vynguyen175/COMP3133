const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');

const PORT = process.env.PORT || 4000;

async function startServer() {
  // Create Express app and HTTP server
  const app = express();
  const httpServer = http.createServer(app);

  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Start Apollo Server
  await server.start();

  // Apply middleware
  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  // Start HTTP server
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`
    =====================================================
      COMP3133 Lab 05 - GraphQL Movies API
    =====================================================
      Server is running!

      GraphQL Endpoint: http://localhost:${PORT}/graphql

      Open the URL above in your browser to access
      Apollo Sandbox (GraphiQL interface)
    =====================================================
  `);
}

startServer().catch(console.error);
