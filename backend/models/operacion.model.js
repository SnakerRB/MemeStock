module.exports = (sequelize, DataTypes) => {
  const Operacion = sequelize.define(
    "Operacion",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      memeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM("compra", "venta"),
        allowNull: false,
      },
      precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      tableName: "Operaciones",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: false,
    }
  );

  return Operacion;
};
