const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

// Crear instancia de Sequelize
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

// Objeto para contener todos los modelos
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Cargar modelos
db.Usuario = require("./Usuario.model")(sequelize, DataTypes);
db.Meme = require("./Meme.model")(sequelize, DataTypes);
db.PrecioMemes = require("./PrecioMemes.model")(sequelize, DataTypes);
db.Operacion = require("./Operacion.model")(sequelize, DataTypes);
db.TrendingMeme = require("./TrendingMeme.model")(sequelize, DataTypes);

// Asociaciones
db.Usuario.hasMany(db.Operacion, { foreignKey: "userId", onDelete: "CASCADE", as: "operaciones" });
db.Operacion.belongsTo(db.Usuario, { foreignKey: "userId", as: "usuario" });

db.Meme.hasMany(db.Operacion, { foreignKey: "memeId", onDelete: "CASCADE" });
db.Operacion.belongsTo(db.Meme, { foreignKey: "memeId", as: "meme"});

db.Meme.hasMany(db.PrecioMemes, { foreignKey: "memeId", onDelete: "CASCADE" });
db.PrecioMemes.belongsTo(db.Meme, { foreignKey: "memeId" });

db.Meme.hasMany(db.TrendingMeme, { foreignKey: "memeId", onDelete: "CASCADE" });
db.TrendingMeme.belongsTo(db.Meme, { foreignKey: "memeId" });

// Llamar a associate si existe en cada modelo
if (db.Meme.associate) db.Meme.associate(db);
if (db.Usuario.associate) db.Usuario.associate(db);
if (db.PrecioMemes.associate) db.PrecioMemes.associate(db);
if (db.Operacion.associate) db.Operacion.associate(db);
if (db.TrendingMeme.associate) db.TrendingMeme.associate(db);

module.exports = db;
