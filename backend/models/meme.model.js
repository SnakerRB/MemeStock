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
    imagen: {
      type: DataTypes.STRING,
    },
    categoria: {
      type: DataTypes.STRING,
    },
    rareza: {
      type: DataTypes.ENUM("popular", "raro", "nuevo"),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "Memes",
  });

  // Asociaciones
  Meme.associate = (models) => {
    Meme.hasMany(models.PrecioMemes, {
      foreignKey: "memeId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Meme;
};
