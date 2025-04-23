const operacionesService = require("../services/operaciones.service");

const registrarOperacion = async (req, res) => {
  try {
    const { tipo, memeId, nombre, precio, userId, timestamp } = req.body;

    if (!tipo || !memeId || !nombre || !precio || !userId) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    await operacionesService.crearOperacion({ tipo, memeId, nombre, precio, userId, timestamp });
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

module.exports = {
  registrarOperacion,
  listarOperaciones,
};
