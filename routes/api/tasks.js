const express = require("express");
const router = express.Router();
const taskController = require('../../controller/task.controller');
const logger = require('../../logger/logger');

router.get("/test", (req, res) => res.json({ msg: "This is the tasks route" }));

router.get("/", (req, res) => {
  taskController.getTasks().then(data => res.json(data));
});

router.get("/:id", (req, res) => {
  taskController.getTask(req.params.id).then(data => res.json(data));
});

router.post('/', (req, res) => {
  logger.info("create task payload: " + req.body);
  taskController.createTask(req.body.task).then(data => res.json(data));
});

router.put('/', (req, res) => {
  taskController.updateTask(req.body.task).then(data => res.json(data));
});

router.delete('/:id', (req, res) => {
  taskController.deleteTask(req.params.id).then(data => res.json(data));
});

module.exports = router;