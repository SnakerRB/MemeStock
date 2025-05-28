const { Usuario, Operacion, Meme } = require("../models");

exports.createOrFindUser = async (req, res) => {
  const { id, nombre } = req.body;

  if (!id || !nombre) {
    return res.status(400).json({ error: "Faltan datos obligatorios: id o nombre" });
  }

  try {
    const [usuario, creado] = await Usuario.findOrCreate({
      where: { id },
      defaults: { nombre }
    });

    res.status(200).json({
      message: creado ? "Usuario creado" : "Usuario ya existía",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        saldo: usuario.saldo,
      },
    });

  } catch (error) {
    console.error("Error al procesar el usuario:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

exports.getUserData = async (req, res) => {
  const { userId } = req.params;

  try {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtenemos las operaciones de compra del usuario
    const operaciones = await Operacion.findAll({
      where: { userId, tipo: "compra" },
      include: [{ model: Meme }],
    });

    // Agrupamos por meme para acumular cantidades
    const carteraMap = new Map();

    for (const op of operaciones) {
      const meme = op.Meme;
      if (!meme) continue; // Si por alguna razón el meme no existe

      const key = meme.id;
      const existente = carteraMap.get(key);

      if (existente) {
        existente.cantidad += op.cantidad || 1;
      } else {
        carteraMap.set(key, {
          id: meme.id,
          name: meme.nombre,
          image: meme.imagen,
          price: op.precio, // último precio de compra
          change: meme.change || "0", // opcional: solo si existe
          volume: meme.volume || "0", // opcional: solo si existe
          cantidad: op.cantidad || 1,
        });
      }
    }

    const cartera = Array.from(carteraMap.values());

    res.json({
      saldo: usuario.saldo,
      cartera,
    });

  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
