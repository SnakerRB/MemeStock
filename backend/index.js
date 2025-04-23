const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const pingRoutes = require("./routes/ping.routes");
const userRoutes = require("./routes/user.routes");
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.use("/api/ping", pingRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => res.send("MemeStock API online 🚀"));

const db = require("./models");

db.sequelize.sync({ force: false }).then(() => {
  console.log("✅ Base de datos sincronizada.");
});

app.listen(PORT, () => {
    console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
  });
