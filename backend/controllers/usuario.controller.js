const db = require("../models");
const Usuario = db.Usuario;

exports.createOrFindUser = async (req, res) => {
  const { id, nombre } = req.body;

  if (!id || !nombre) {
    return res.status(400).json({ error: "Faltan datos obligatorios: id o nombre" });
  }

  try {
    const [usuario, creado] = await Usuario.findOrCreate({
      where: { id },
      defaults: {
        nombre,
        saldo: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: creado ? "Usuario creado" : "Usuario ya existía",
      usuario: {
        id: usuario.id,
        saldo: usuario.saldo,
      },
    });

  } catch (error) {
    console.error("Error al procesar el usuario:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
