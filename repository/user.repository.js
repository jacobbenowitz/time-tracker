const { connect } = require('../config/db.config');
const logger = require('../logger/logger');
const constants = require('../constants/constants');
const validateRegisterInput = require('../validation/register');
class UserRepository {

  db = {};

  constructor() {
    this.db = connect();
    // For Development
    this.db.sequelize.sync().then(() => {
      logger.info("Sync completed.");
    });
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
      if (user !== null) {
        logger.info('found user: ', user);
        return user;
      } else {
        return {
          statusCode: 'USER_NOT_FOUND',
          message: 'No user found with that id'
        };
      }
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
      const currentUser = await this.db.users.findOne({
        where: { id: user.id }
      });

      if (user.password) {
        user.password2 = user.password;
      } else {
        user.password = currentUser.dataValues.password_digest;
        user.password2 = currentUser.dataValues.password_digest;
      }

      const newUser = {
        ...currentUser.dataValues,
        ...user,
        updated_at: new Date().toISOString()
      }

      const { errors, isValid } = validateRegisterInput(newUser);

      if (!isValid) {
        return {
          statusCode: "VALIDATION_ERROR",
          message: Object.values(errors).join(', ')
        };
      }

      await this.db.users.update(newUser, {
        where: {
          id: user.id
        }
      });

      data = await this.db.users.findOne({
        where: { id: user.id }
      });
    } catch (err) {
      logger.error('Error updating user: ' + err);
      data = {
        statusCode: "UPDATE_ERROR",
        message: err
      };
    }
    return data;
  }

  async deleteUser(userId) {
    let data = {};
    try {
      await this.db.users.destroy({
        where: {
          id: userId
        }
      });
      data = {
        statusCode: "DELETE_SUCCESS",
        message: "User deleted successfully"
      };
    } catch (err) {
      logger.error('Error deleting user: ' + err);
      data = {
        statusCode: "DELETE_ERROR",
        message: err
      };
    }
    return data;
  }

}

module.exports = new UserRepository();