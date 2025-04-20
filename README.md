# 🧠 MemeStock – La Bolsa de Valores de los Memes

**MemeStock** es una plataforma donde los usuarios pueden "invertir" en memes como si fueran acciones. Los precios fluctúan según su viralidad. El objetivo es gamificar el mercado de tendencias online.

---

## 📦 Estructura del proyecto

```bash
MemeStock/
├── frontend/       # React + Tailwind
├── backend/        # Node.js + Express
├── scraper/        # Python scraper (próximamente)
└── docker-compose.yml
```

---

## 🚀 Tecnologías principales

### Frontend
- React + Vite
- Tailwind CSS
- Recharts o Chart.js
- Firebase Auth

### Backend
- Node.js + Express
- MariaDB
- Sequelize ORM
- Socket.IO
- Docker

### Infraestructura
- Docker + Docker Compose
- NAS personal con Nginx
- Scraping: Python (BeautifulSoup/Selenium)

---

## ⚙️ Cómo levantar el proyecto localmente

### 1. Clona el repositorio

```bash
git clone https://github.com/SnakerRB/MemeStock
cd MemeStock
```

### 2. Ejecuta los servicios con Docker
```bash
docker-compose up --build
```
#### Esto levanta:
- memestock-backend (puerto 3000)
- memestock-db (MariaDB, puerto 3306)
- memestock-scraper (en espera)

### 3. Inicia el frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
- Accede a la web desde: http://localhost:5173

---

## 📂 Dependencias iniciales

### Frontend
- react
- tailwindcss
- vite
- firebase
- recharts (opcional para gráficos)

### Backend
- express
- cors
- dotenv
- sequelize
- mariadb 
- socket.io

---

## 📑 Estructura técnica
- Autenticación por Firebase o JWT
- Backend modular con rutas/controladores/servicios
- WebSocket para actualizaciones en tiempo real
- Scraping planificado para datos de Reddit y Google Trends

---

## 🧑‍💻 Autor
Proyecto desarrollado por Daniel R.B. como Trabajo Final de Ciclo (TFC).