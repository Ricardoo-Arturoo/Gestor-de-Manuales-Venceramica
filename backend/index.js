const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Permite que Vue se conecte sin errores de seguridad
app.use(express.json()); // Permite entender los datos JSON que envía Vue

// Conexión a la base de datos MySQL (Ajustado para XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Usuario por defecto de XAMPP
  password: '',      // XAMPP no tiene contraseña por defecto
  database: 'venceramica_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('¡Conectado exitosamente a la base de datos MySQL!');
});

// Ruta de Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Consulta a la base de datos
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      const user = results[0];
      res.status(200).json({
        message: 'Login exitoso',
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
  });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});