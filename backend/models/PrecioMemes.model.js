module.exports = (sequelize, DataTypes) => {
  const PrecioMemes = sequelize.define("PrecioMemes", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  PrecioMemes.associate = (models) => {
    PrecioMemes.belongsTo(models.Meme, {
      foreignKey: "memeId",
      onDelete: "CASCADE",
    });
  };

  return PrecioMemes;
};
