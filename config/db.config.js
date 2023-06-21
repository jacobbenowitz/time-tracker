const { Sequelize, Model, DataTypes } = require("sequelize");
const logger = require('../logger/logger');

const connect = () => {

  const hostName = process.env.HOST;
  const userName = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const database = process.env.DATABASE;
  const dialect = process.env.DIALECT;

  const sequelize = new Sequelize(database, userName, password, {
    host: hostName,
    dialect: dialect,
  });

  sequelize.authenticate().then(() => {
    logger.info('Connection has been established successfully.');
  }).catch((error) => {
    logger.error('Unable to connect to the database: ' + error);
  });

  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.tasks = require("../model/task.model")(sequelize, DataTypes, Model);
  db.users = require("../model/user.model")(sequelize, DataTypes, Model);

  return db;
}

module.exports = {
  connect
}