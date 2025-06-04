// utils/avatarDownloader.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const downloadAvatar = async (url, filename) => {
  const avatarsDir = path.join(__dirname, '../public/avatars');
  const avatarPath = path.join(avatarsDir, filename);

  // Si ya existe, no volvemos a descargar
  if (fs.existsSync(avatarPath)) {
    return `/avatars/${filename}`; // Ruta pública para servir
  }

  try {
    // Asegurar que el directorio existe
    fs.mkdirSync(avatarsDir, { recursive: true });

    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(avatarPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`/avatars/${filename}`));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('❌ Error descargando avatar:', error);
    return null;
  }
};

module.exports = {
  downloadAvatar,
};
