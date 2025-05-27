const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  logging: false,
  dialectOptions: {
    allowPublicKeyRetrieval: true,
    ssl: false, 
  },
});

// Instancia del objeto global de base de datos
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Cargar modelos
db.Usuario = require("./usuario.model")(sequelize, DataTypes);
db.Meme = require("./meme.model")(sequelize, DataTypes);
db.Operacion = require("./operacion.model")(sequelize, DataTypes);

// Definir relaciones
db.Usuario.hasMany(db.Operacion, { foreignKey: "userId" });
db.Operacion.belongsTo(db.Usuario, { foreignKey: "userId" });

db.Meme.hasMany(db.Operacion, { foreignKey: "memeId" });
db.Operacion.belongsTo(db.Meme, { foreignKey: "memeId" });

module.exports = db;
