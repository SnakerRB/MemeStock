const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require("./models"); // Sequelize y modelos
const operacionesRoutes = require('./routes/operaciones.routes'); 
const pingRoutes = require("./routes/operaciones.routes");
const userRoutes = require("./routes/usuario.routes");
const memeRoutes = require("./routes/meme.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('MemeStock backend está funcionando 🚀');
});

// Rutas del API
app.use('/api/operaciones', operacionesRoutes);
app.use("/api/ping", pingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/meme", memeRoutes);

// Sincronizar todos los modelos y relaciones
db.sequelize
  .sync({ alter: true }) // actualizar sin borrar datos
  .then(() => {
    console.log("📦 Base de datos conectada y sincronizada correctamente");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar con la base de datos:", error);
  });
