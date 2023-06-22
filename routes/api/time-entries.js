const express = require("express");
const router = express.Router();
const taskService = require('../../service/time-entries.service');
const logger = require('../../logger/logger');

router.get("/test", (req, res) => res.json({
  msg: "This is the time-entries route"
}));

router.get("/", async (req, res) => {
  logger.info('getting all time-entries')
  return await taskService.getTasks().then(data =>
    res.json(data)
  );
});

router.post('/', async (req, res) => {
  logger.info("create time-entries payload: ", req.body);
  return await taskService.createTask(req.body.task).then(data =>
    res.json(data)
  );
});

router.get("/:id", async (req, res) => {
  logger.info('getting time-entries by id: ' + req.params.id);
  return await taskService.getTask(req.params.id).then(data =>
    res.json(data)
  );
});

router.get('/user/:userId', async (req, res) => {
  logger.info(`getting time-entries for user ${req.params.userId}`);
  return await taskService.getTaskByUser(req.params.userId).then(data =>
    res.json(data)
  );
});

router.put('/:id', async (req, res) => {
  logger.info('update time-entries payload: ', req.body);
  return await taskService.updateTask(req.body.task, req.params.id).then(data =>
    res.json(data)
  );
});

router.delete('/:id', async (req, res) => {
  taskService.deleteTask(req.params.id).then(data =>
    res.json(data)
  );
});

module.exports = router;