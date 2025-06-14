CREATE DATABASE memestock;
USE  memestock;

-- Tabla Usuarios
CREATE TABLE Usuarios (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    saldo FLOAT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla Memes
CREATE TABLE Memes (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    imagen VARCHAR(255),
    categoria VARCHAR(100),
    rareza ENUM('popular', 'raro', 'nuevo'),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla PrecioMemes
CREATE TABLE PrecioMemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memeId VARCHAR(255),
    precio FLOAT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (memeId) REFERENCES Memes(id) ON DELETE CASCADE
);

-- Tabla Operaciones
CREATE TABLE Operaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255),
    memeId VARCHAR(255),
    tipo ENUM('compra', 'venta') NOT NULL,
    precio FLOAT NOT NULL,
    cantidad INT DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (memeId) REFERENCES Memes(id) ON DELETE CASCADE
);

-- Tabla Trending_Memes
CREATE TABLE Trending_Memes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memeId VARCHAR(255),
    score INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (memeId) REFERENCES Memes(id) ON DELETE CASCADE
);
