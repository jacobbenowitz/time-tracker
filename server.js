require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require('./logger/logger');
const tasks = require('./routes/api/tasks');

// express app initialization
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use('/api/tasks', tasks)

app.get('/', (req, res) => {
  res.send(`<h1>Hello world!</h1>`)
});

// listen for requests
app.listen(port, () => {
  logger.info(`Server listening on the port  ${port}`);
})