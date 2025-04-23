const Operacion = require("../models/operacion.model");

const crearOperacion = async ({ tipo, memeId, nombre, precio, userId, timestamp }) => {
  return await Operacion.create({
    tipo,
    memeId,
    nombre,
    precio,
    userId,
    timestamp: timestamp || new Date(),
  });
};

const obtenerOperacionesPorUsuario = async (userId) => {
  return await Operacion.findAll({
    where: { userId },
    order: [["timestamp", "DESC"]],
  });
};

module.exports = {
  crearOperacion,
  obtenerOperacionesPorUsuario,
};
