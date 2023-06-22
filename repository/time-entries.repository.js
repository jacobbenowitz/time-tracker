const { connect } = require('../config/db.config');
const logger = require('../logger/logger');
const constants = require('../constants/constants');
const validateTimeEntry = require('../validation/time-entry');
class TimeEntriesRepository {

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
      logger.error('error getting all tasks: ' + err);
      return [];
    }
  }

  async getTask(taskId) {
    try {
      const task = await this.db.tasks.findOne({
        where: { id: taskId }
      });
      logger.info('found time entry: ', task);
      return task;
    } catch (err) {
      logger.error(`error finding time entry by id ${taskId}, error: ` + err);
      return [];
    }
  }

  async getTaskByUser(userId) {
    try {
      const task = await this.db.tasks.findOne({
        where: { user_id: userId }
      });
      logger.info('found time entry: ', task);
      return task;
    } catch (err) {
      logger.error(`error finding time entry by id ${userId}, error: ` + err);
      return [];
    }
  }

  async createTask(task) {
    let data = {};
    try {
      // validate user id
      const user = await this.db.users.findOne({
        where: { id: task.user_id }
      });
      if (!user) {
        logger.info(`invalid user id provided when creating task: ${task.user_id}`);
        return {
          "statusCode": "VALIDATION_ERROR",
          "message": "Invalid user id provided"
        };
      }
      // validate data
      const { errors, isValid } = validateTimeEntry(task);

      if (!isValid) {
        return {
          statusCode: "VALIDATION_ERROR",
          message: Object.values(errors).join(', ')
        };
      }

      task.created_at = new Date().toISOString();
      task.created_by = constants.BACKEND_USER;
      task.updated_at = new Date().toISOString();
      data = await this.db.tasks.create(task);
    } catch (err) {
      logger.error('Error creating time entry: ' + err);
      data = {
        "statusCode": "ERROR",
        "message": "Error creating time entry, please check the fields and try again"
      };
    }
    return data;
  }

  async updateTask(task, taskId) {
    let data = {};
    try {
      task.updated_at = new Date().toISOString();
      await this.db.tasks.update({ ...task }, {
        where: {
          id: taskId
        }
      });
      data = await this.db.tasks.findOne({
        where: { id: taskId }
      });
    } catch (err) {
      logger.error('Error updating task: ' + err);
      data = {
        "statusCode": "ERROR",
        "message": "Error updating time entry, please check the fields and try again"
      };
    }
    return data;
  }

  async deleteTask(taskId) {
    let data = {};
    try {
      await this.db.tasks.destroy({
        where: {
          id: taskId
        }
      });
      data = {
        "statusCode": "SUCCESS",
        "message": "Time entry deleted successfully"
      }
    } catch (err) {
      logger.error('Error deleting task: ' + err);
      data = {
        "statusCode": "ERROR",
        "message": "Error deleting time entry, please check the fields and try again"
      };
    }
    return data;
  }

}

module.exports = new TimeEntriesRepository();