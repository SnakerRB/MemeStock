const operacionesService = require("../services/operaciones.service");
const db = require("../models"); 

const registrarOperacion = async (req, res) => {
  try {
    const { tipo, memeId, precio, userId, cantidad } = req.body;

    if (!tipo || !memeId || !precio || !userId) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    await operacionesService.crearOperacion({ tipo, memeId, precio, userId, cantidad });
    res.status(201).json({ mensaje: "Operación registrada correctamente" });
  } catch (error) {
    console.error("Error al registrar operación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const listarOperaciones = async (req, res) => {
  try {
    const { userId } = req.params;
    const operaciones = await operacionesService.obtenerOperacionesPorUsuario(userId);
    res.json(operaciones);
  } catch (error) {
    console.error("Error al obtener operaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const rankingInversores = async (req, res) => {
  try {
    const usuarios = await db.Usuario.findAll({
      attributes: ["id", "nombre", "avatar"], // 👈 Incluimos el avatar aquí
      include: [
        {
          model: db.Operacion,
          as: "operaciones",
          attributes: ["tipo", "precio", "cantidad"],
        },
      ],
    });

    const ranking = usuarios.map((usuario) => {
      let totalCompras = 0;
      let totalVentas = 0;

      usuario.operaciones.forEach((op) => {
        if (op.tipo === "compra") {
          totalCompras += op.precio * op.cantidad;
        } else if (op.tipo === "venta") {
          totalVentas += op.precio * op.cantidad;
        }
      });

      const ganancias = totalVentas - totalCompras;
      const rentabilidad = totalCompras > 0 ? (ganancias / totalCompras) * 100 : 0;

      return {
        id: usuario.id,
        nombre: usuario.nombre,
        avatar: usuario.avatar, // 👈 Devolvemos el avatar
        rentabilidad: parseFloat(rentabilidad.toFixed(2)),
      };
    });

    // Ordenar por rentabilidad descendente
    ranking.sort((a, b) => b.rentabilidad - a.rentabilidad);

    res.json(ranking);
  } catch (error) {
    console.error("Error al generar ranking:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerMemesComprados = async (req, res) => {
  try {
    const { userId } = req.params;

    const memes = await operacionesService.obtenerMemesCompradosPorUsuario(userId);

    res.json(memes);
  } catch (error) {
    console.error("Error al obtener memes comprados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerHistorialOperaciones = async (req, res) => {
  try {
    const { userId } = req.params;
    const operaciones = await operacionesService.obtenerHistorialOperacionesPorUsuario(userId);

    // Mapear el formato para el front
    const historial = operaciones.map((op) => ({
      id: op.id,
      tipo: op.tipo,
      precio: op.precio,
      cantidad: op.cantidad,
      memeId: op.memeId,
      memeNombre: op.meme.nombre,
      createdAt: op.createdAt,
    }));

    res.json(historial);
  } catch (error) {
    console.error("Error al obtener historial de transacciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  registrarOperacion,
  listarOperaciones,
  rankingInversores,
  obtenerMemesComprados,
  obtenerHistorialOperaciones,
};
