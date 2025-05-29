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

    const operaciones = await Operacion.findAll({
      where: { userId },
      include: [{ model: Meme }],
      order: [["createdAt", "ASC"]], // importante para conservar el orden de compra/venta
    });

    const carteraMap = new Map();

    for (const op of operaciones) {
      const meme = op.Meme;
      if (!meme) continue;

      const key = meme.id;
      const existente = carteraMap.get(key);

      if (!existente) {
        carteraMap.set(key, {
          id: meme.id,
          nombre: meme.nombre,
          imagen: meme.imagen,
          categoria: meme.categoria,
          rareza: meme.rareza,
          cantidad: 0,
          precioCompra: 0,
          fechaCompra: null,
        });
      }

      const actual = carteraMap.get(key);

      if (op.tipo === "compra") {
        actual.cantidad += op.cantidad;
        actual.precioCompra = op.precio;
        actual.fechaCompra = op.createdAt;
      } else if (op.tipo === "venta") {
        actual.cantidad -= op.cantidad;
      }

      // Si el usuario vendió todos los que tenía, eliminamos el meme de la cartera
      if (actual.cantidad <= 0) {
        carteraMap.delete(key);
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