module.exports = (sequelize, DataTypes) => {
  const Operacion = sequelize.define("Operacion", {
    tipo: {
      type: DataTypes.ENUM("compra", "venta"),
      allowNull: false,
    },
    memeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Operacion;
};
