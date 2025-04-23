const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = require("./user.model")(sequelize, DataTypes);

module.exports = db;
