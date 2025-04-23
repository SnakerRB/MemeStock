module.exports = {
  DB: process.env.DB_NAME || "memestock",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "password",
  HOST: process.env.DB_HOST || "mariadb",
  dialect: "mariadb",
};
