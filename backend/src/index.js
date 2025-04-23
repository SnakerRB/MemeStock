const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db'); // conexión Sequelize
const operacionesRoutes = require('./routes/operaciones.routes'); 
const pingRoutes = require("./routes/ping.routes");
const userRoutes = require("./routes/user.routes");

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

// Sincronizar modelos con BBDD y lanzar servidor
db.sync({ alter: true }) // 'alter: true' actualiza columnas sin perder datos
  .then(() => {
    console.log("📦 Base de datos conectada y sincronizada correctamente");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar con la base de datos:", error);
  });
