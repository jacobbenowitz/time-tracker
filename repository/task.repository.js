const { connect } = require('../config/db.config');
const logger = require('../logger/logger');
const constants = require('../constants/constants');

class TaskRepository {

  db = {};

  constructor() {
    this.db = connect();
    // For Development
    // this.db.sequelize.sync({ force: true }).then(() => {
    //   log.info("Dropped table and db sync completed.");
    // });
  }

  async getTasks() {
    try {
      const tasks = await this.db.tasks.findAll();
      logger.info('tasks: ', tasks);
      return tasks;
    } catch (err) {
      logger.error(err);
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
      logger.error('Error: ' + err);
    }
    return data;
  }

  async updateTask(task) {
    let data = {};
    try {
      task.updated_at = new Date().toISOString();
      data = await this.db.tasks.update({ ...task }, {
        where: {
          id: task.id
        }
      });
    } catch (err) {
      logger.error('Error::' + err);
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
      logger.error('Error::' + err);
    }
    return data;
  }

}

module.exports = new TaskRepository();