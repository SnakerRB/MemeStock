module.exports = (sequelize, DataTypes) => {
  const Meme = sequelize.define("Meme", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    change: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    volume: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Meme;
};
