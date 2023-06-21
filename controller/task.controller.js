const taskService = require('../service/task.service');
const logger = require('../logger/logger');

class TaskController {

  async getTasks() {
    logger.info('Controller: getTasks')
    return await taskService.getTasks();
  }

  async getTask(taskId) {
    logger.info('Controller: getTask')
    return await taskService.getTask(taskId);
  }

  async createTask(task) {
    logger.info('Controller: createTask', task);
    return await taskService.createTask(task);
  }

  async updateTask(task) {
    logger.info('Controller: updateTask', task);
    return await taskService.updateTask(task);
  }

  async deleteTask(taskId) {
    logger.info('Controller: deleteTask', taskId);
    return await taskService.deleteTask(taskId);
  }
}
module.exports = new TaskController();