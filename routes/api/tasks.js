const express = require("express");
const router = express.Router();
const taskService = require('../../service/task.service');
const logger = require('../../logger/logger');

router.get("/test", (req, res) => res.json({ msg: "This is the tasks route" }));

router.get("/", async (req, res) => {
  logger.info('getting all tasks')
  return await taskService.getTasks().then(data =>
    res.json(data)
  );
});

router.get("/:id", async (req, res) => {
  logger.info('getting task by id: ' + req.params.id);
  return await taskService.getTask(req.params.id).then(data =>
    res.json(data)
  );
});

router.post('/', async (req, res) => {
  logger.info("create task payload: ", req.body);
  return await taskService.createTask(req.body.task).then(data =>
    res.json(data)
  );
});

router.put('/', async (req, res) => {
  logger.info('update task payload: ', req.body);
  return await taskService.updateTask(req.body.task).then(data =>
    res.json(data)
  );
});

router.delete('/:id', async (req, res) => {
  taskService.deleteTask(req.params.id).then(data =>
    res.json(data)
  );
});

module.exports = router;