const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const app = express();

async function startServer() {
  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError) => {
      return {
        message: formattedError.message,
        code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    },
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
    console.log(`GraphiQL playground available at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
