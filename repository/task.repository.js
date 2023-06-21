const { connect } = require('../config/db.config');
const logger = require('../logger/logger');
const constants = require('../constants/constants');

class TaskRepository {

  db = {};

  constructor() {
    this.db = connect();
    // For Development
    this.db.sequelize.sync().then(() => {
      logger.info("Sync completed.");
    });
  }

  async getTasks() {
    try {
      const tasks = await this.db.tasks.findAll();
      logger.info('tasks: ', tasks);
      return tasks;
    } catch (err) {
      logger.error('Error getting all tasks: ' + err);
      return [];
    }
  }

  async getTask(taskId) {
    try {
      const task = await this.db.tasks.findOne({
        where: { id: taskId }
      });
      logger.info('found task: ', task);
      return task;
    } catch (err) {
      logger.error(`error finding task by id ${taskId}, error: ` + err);
      return [];
    }
  }

  async createTask(task) {
    let data = {};
    try {
      task.created_at = new Date().toISOString();
      task.created_by = constants.BACKEND_USER;
      task.updated_at = new Date().toISOString();
      data = await this.db.tasks.create(task);
    } catch (err) {
      logger.error('Error creating task: ' + err);
    }
    return data;
  }

  async updateTask(task) {
    let data = {};
    try {
      task.updated_at = new Date().toISOString();
      await this.db.tasks.update({ ...task }, {
        where: {
          id: task.id
        }
      });
      data = await this.db.tasks.findOne({
        where: { id: task.id }
      });
    } catch (err) {
      logger.error('Error updating task: ' + err);
    }
    return data;
  }

  async deleteTask(taskId) {
    let data = {};
    try {
      data = await this.db.tasks.destroy({
        where: {
          id: taskId
        }
      });
    } catch (err) {
      logger.error('Error deleting task: ' + err);
    }
    return data;
  }

}

module.exports = new TaskRepository();