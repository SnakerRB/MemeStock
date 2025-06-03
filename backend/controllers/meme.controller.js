const { Op } = require("sequelize");
const db = require("../models");
const Meme = db.Meme;
const PrecioMemes = db.PrecioMemes;

// Obtener todos los memes con su precio más reciente
const getMemes = async (req, res) => {
  try {
    const memes = await Meme.findAll({
      include: [
        {
          model: PrecioMemes,
          limit: 1,
          order: [["timestamp", "DESC"]],
        },
      ],
    });

    const datos = memes.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      imagen: m.imagen,
      categoria: m.categoria,
      rareza: m.rareza,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      precio: m.PrecioMemes?.[0]?.precio || null,
      precioTimestamp: m.PrecioMemes?.[0]?.timestamp || null,
    }));

    res.json(datos);
  } catch (error) {
    console.error("❌ Error al obtener los memes:", error);
    res.status(500).json({ message: "Error al obtener los memes" });
  }
};

// Obtener un meme por ID con su historial de precios de los últimos 7 días
const getMemeById = async (req, res) => {
  const { id } = req.params;
  const sieteDiasAtras = new Date();
  sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

  try {
    const meme = await Meme.findByPk(id, {
      include: [
        {
          model: PrecioMemes,
          where: {
            timestamp: {
              [Op.gte]: sieteDiasAtras,
            },
          },
          order: [["timestamp", "ASC"]],
        },
      ],
    });

    if (!meme) {
      return res.status(404).json({ message: "Meme no encontrado" });
    }

    res.json({
      id: meme.id,
      nombre: meme.nombre,
      imagen: meme.imagen,
      categoria: meme.categoria,
      rareza: meme.rareza,
      createdAt: meme.createdAt,
      updatedAt: meme.updatedAt,
      historial: meme.PrecioMemes.map((p) => ({
        precio: p.precio,
        timestamp: p.timestamp,
      })),
    });
  } catch (error) {
    console.error("❌ Error al obtener el meme:", error);
    res.status(500).json({ message: "Error al obtener el meme" });
  }
};

const getMemesSummary = async (req, res) => {
  const { Op } = require("sequelize");
  const ahora = new Date();
  const hace24Horas = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

  try {
    // Carga todos los memes
    const memes = await Meme.findAll({
      include: [
        {
          model: PrecioMemes,
          where: {
            timestamp: {
              [Op.gte]: hace24Horas, // Solo precios de las últimas 24h
            },
          },
          order: [["timestamp", "ASC"]],
        },
      ],
    });

    const resumen = memes.map((meme) => {
      const historial = meme.PrecioMemes;

      if (!historial || historial.length === 0) {
        return {
          id: meme.id,
          nombre: meme.nombre,
          imagen: meme.imagen,
          rareza: meme.rareza,
          precio: null,
          cambio24h: 0,
          volumen24h: 0,
        };
      }

      // Precio actual es el último
      const precioActual = historial[historial.length - 1].precio;

      // Precio hace 24h es el primero disponible
      const precioHace24h = historial[0].precio;

      const cambio24h = ((precioActual - precioHace24h) / precioHace24h) * 100;

      // Volumen es la suma de precios en 24h
      const volumen24h = historial.reduce(
        (sum, registro) => sum + registro.precio,
        0
      );

      return {
        id: meme.id,
        nombre: meme.nombre,
        imagen: meme.imagen,
        rareza: meme.rareza,
        precio: precioActual,
        cambio24h: parseFloat(cambio24h.toFixed(2)),
        volumen24h: parseFloat(volumen24h.toFixed(2)),
      };
    });

    res.json(resumen);
  } catch (error) {
    console.error("❌ Error al obtener el resumen de memes:", error);
    res.status(500).json({ message: "Error al obtener el resumen de memes" });
  }
};

module.exports = {
  getMemes,
  getMemeById,
  getMemesSummary,
};
