const db = require("../models");
const Meme = db.Meme;

// Obtener todos los memes
const getMemes = async (req, res) => {
  try {
    const memes = await Meme.findAll();
    res.json(memes);
  } catch (error) {
    console.error("❌ Error al obtener los memes:", error);
    res.status(500).json({ message: "Error al obtener los memes" });
  }
};

// Obtener un meme por ID
const getMemeById = async (req, res) => {
  const { id } = req.params;
  try {
    const meme = await Meme.findByPk(id);
    if (!meme) {
      return res.status(404).json({ message: "Meme no encontrado" });
    }
    res.json(meme);
  } catch (error) {
    console.error("❌ Error al obtener el meme:", error);
    res.status(500).json({ message: "Error al obtener el meme" });
  }
};

module.exports = {
  getMemes,
  getMemeById,
};
