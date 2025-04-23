const db = require("../models");
const User = db.user;

exports.getUserMock = async (req, res) => {
  const [user] = await User.findOrCreate({
    where: { email: "fakeuser@example.com" },
    defaults: { name: "Usuario de prueba" },
  });

  res.json(user);
};
