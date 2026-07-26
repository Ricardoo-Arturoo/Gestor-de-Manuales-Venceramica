-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS venceramica_db;

-- 2. Seleccionar la base de datos para usarla
USE venceramica_db;

-- 3. Crear la tabla de usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
);

-- 4. Insertar usuarios de prueba (simulando tu db.json)
INSERT INTO users (name, email, password, role) VALUES
('Ricardo', 'admin@gmail.com', '123', 'admin'),
