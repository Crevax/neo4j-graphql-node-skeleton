/* eslint-disable comma-dangle */
const express = require('express');
const neo4j = require('neo4j-driver').v1;
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');
const config = require('./config.js');
const schema = require('./schema');
/* eslint-enable comma-dangle */

const app = express();

let driver;
function context(headers) {
  if (!driver) {
    driver = neo4j.driver(
      `${config.DB_SERVER}:${config.DB_PORT}`,
      neo4j.auth.basic(config.DB_USER, config.DB_PASSWORD)
    );
  }
  return {
    driver,
    headers,
  };
}

const rootValue = {};

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/ping', (req, res) => {
  // TODO: Use driver from context?
  const driverLocal = neo4j.driver(
    `${config.DB_SERVER}:${config.DB_PORT}`,
    neo4j.auth.basic(config.DB_USER, config.DB_PASSWORD)
  );

  const session = driverLocal.session();

  session.run('MATCH (n) RETURN count(n) LIMIT 1').then(
    () => {
      session.close();

      res.send('We are connected');

      driverLocal.close();
    },
    (error) => {
      res.send(error.message);
    }
  );
});

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress((request) => ({
    schema,
    rootValue,
    context: context(request.headers),
  }))
);

app.listen(config.PORT, () => {
  console.log(`Example app listening on port ${config.PORT}!`);
});
