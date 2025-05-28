module.exports = (sequelize, DataTypes) => {
  const TrendingMeme = sequelize.define("TrendingMeme", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return TrendingMeme;
};
