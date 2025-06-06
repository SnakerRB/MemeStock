const db = require("../models");
const { Operacion, Usuario } = db;

const crearOperacion = async ({ tipo, memeId, precio, userId, cantidad = 1 }) => {
  const usuario = await Usuario.findByPk(userId);
  if (!usuario) throw new Error("Usuario no encontrado");

  const total = precio * cantidad;

  if (tipo === "compra") {
    if (usuario.saldo < total) {
      throw new Error("Saldo insuficiente para realizar la compra");
    }
    usuario.saldo -= total;
  } else if (tipo === "venta") {
    usuario.saldo += total;
  } else {
    throw new Error("Tipo de operación no válido");
  }

  await usuario.save();

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

const obtenerMemesCompradosPorUsuario = async (userId) => {
  const operaciones = await db.Operacion.findAll({
    where: {
      userId,
      tipo: "compra",
    },
    attributes: ["memeId"],
    group: ["memeId"], // 👈 Evita repetidos
    include: [
      {
        model: db.Meme, // 👈 Asegúrate de que tienes la relación creada
        as: "meme",
        attributes: ["id", "nombre", "imagen"],
      },
    ],
  });

  return operaciones.map((op) => op.meme);
};

const obtenerHistorialOperacionesPorUsuario = async (userId) => {
  return await db.Operacion.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.Meme,
        as: "meme",
        attributes: ["id", "nombre"],
      },
    ],
  });
};

module.exports = {
  crearOperacion,
  obtenerOperacionesPorUsuario,
  obtenerMemesCompradosPorUsuario,
  obtenerHistorialOperacionesPorUsuario,
};
