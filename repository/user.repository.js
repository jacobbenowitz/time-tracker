const { connect } = require('../config/db.config');
const logger = require('../logger/logger');
const constants = require('../constants/constants');

class UserRepository {

  db = {};

  constructor() {
    this.db = connect();
    // For Development
    // this.db.sequelize.sync({ force: true }).then(() => {
    //   logger.info("Dropped table and db sync completed.");
    // });
  }

  async getUsers() {
    try {
      const users = await this.db.users.findAll();
      logger.info('users: ', users);
      return users;
    } catch (err) {
      logger.error('Error getting all users: ' + err);
      return [];
    }
  }

  async getUser(userId) {
    try {
      const user = await this.db.users.findOne({
        where: { id: userId }
      });
      logger.info('found user: ', user);
      return user;
    } catch (err) {
      logger.error(`error finding user by id ${userId}, error: ` + err);
      return [];
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.db.users.findOne({
        where: { email: email }
      });
      logger.info('found user: ', user);
      return user;
    } catch (err) {
      logger.error(`error finding user by email ${email}, error: ` + err);
      return [];
    }
  }

  async getUserByUsername(username) {
    try {
      const user = await this.db.users.findOne({
        where: { username: username }
      });
      logger.info('found user: ', user);
      return user;
    } catch (err) {
      logger.error(`error finding user by username ${username}, error: ` + err);
      return [];
    }
  }

  async createUser(user) {
    let data = {};
    try {
      user.created_at = new Date().toISOString();
      user.updated_at = new Date().toISOString();
      data = await this.db.users.create(user);
    } catch (err) {
      logger.error('Error creating user: ' + err);
    }
    return data;
  }

  async updateUser(user) {
    let data = {};
    try {
      user.updated_at = new Date().toISOString();
      await this.db.users.update({ ...user }, {
        where: {
          id: user.id
        }
      });
      data = await this.db.users.findOne({
        where: { id: user.id }
      });
    } catch (err) {
      logger.error('Error updating user: ' + err);
    }
    return data;
  }

  async deleteUser(userId) {
    let data = {};
    try {
      data = await this.db.users.destroy({
        where: {
          id: userId
        }
      });
    } catch (err) {
      logger.error('Error deleting user: ' + err);
    }
    return data;
  }

}

module.exports = new UserRepository();