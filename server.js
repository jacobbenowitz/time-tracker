require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const taskController = require('./controller/task.controller');

// express app initialization
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.get('/api/tasks', (req, res) => {
  taskController.getTasks().then(data => res.json(data));
});

app.post('/api/task', (req, res) => {
  logger.info("create task payload: " + req.body);
  taskController.createTask(req.body.task).then(data => res.json(data));
});

app.put('/api/task', (req, res) => {
  taskController.updateTask(req.body.task).then(data => res.json(data));
});

app.delete('/api/task/:id', (req, res) => {
  taskController.deleteTask(req.params.id).then(data => res.json(data));
});

app.get('/', (req, res) => {
  res.send(`<h1>Hello world!</h1>`)
});

app.listen(port, () => {
  log.info(`Server listening on the port  ${port}`);
})