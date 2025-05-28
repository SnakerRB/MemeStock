const db = require("../models");
const Operacion = db.Operacion;

const crearOperacion = async ({ tipo, memeId, precio, userId, cantidad }) => {
  return await Operacion.create({
    tipo,
    memeId,
    precio,
    userId,
    cantidad,
  });
};

const obtenerOperacionesPorUsuario = async (userId) => {
  return await Operacion.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  crearOperacion,
  obtenerOperacionesPorUsuario,
};
