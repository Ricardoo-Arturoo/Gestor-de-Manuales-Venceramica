require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); 
const fs = require('fs');
const multer = require('multer');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get('/', (req, res) => {
  res.send('API Backend de Manuales Venceramica en funcionamiento ');
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('¡Conectado exitosamente a la base de datos MySQL!');
});

// ==========================================
// CONFIGURACIÓN DE MULTER PARA SUBIR PDFs
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads', 'pdfs'));
  },
  filename: (req, file, cb) => {
    const prefijoUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const nombreLimpio = file.originalname.replace(/\s+/g, '_');
    cb(null, prefijoUnico + '-' + nombreLimpio);
  }
});

const upload = multer({ storage: storage });

// ==========================================
// RUTA: Login
// ==========================================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });

    if (results.length > 0) {
      const user = results[0];
      res.status(200).json({
        message: 'Login exitoso',
        user: { name: user.name, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
  });
});

// ==========================================
// RUTA: Descargar PDF
// ==========================================
app.get('/api/descargar/:nombreArchivo', (req, res) => {
  const nombreArchivo = req.params.nombreArchivo;
  const rutaArchivo = path.join(__dirname, 'uploads', 'pdfs', nombreArchivo);

  res.download(rutaArchivo, (err) => {
    if (err) {
      console.error("Error al descargar el archivo:", err);
      res.status(404).json({ message: "El manual no fue encontrado" });
    }
  });
});

// ==========================================
// RUTA: Productos por Categoría
// ==========================================
app.get('/api/productos/:categoria', (req, res) => {
  const categoria = req.params.categoria;
  const sql = 'SELECT * FROM manuales WHERE categoria = ?';
  
  db.query(sql, [categoria], (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.json(resultados);
  });
});

// ==========================================
// RUTA: Crear Producto y Subir PDF (Actualizada)
// ==========================================
app.post('/api/productos', upload.single('pdf'), (req, res) => {
  // Extraemos también 'clasificacion' del req.body enviado por el FormData de Vue
  const { nombre, tipo, categoria, clasificacion } = req.body;
  
  const archivoPdf = req.file ? req.file.filename : null;
  const imagen = 'default.png'; 

  if (!archivoPdf) {
    return res.status(400).json({ message: "Es obligatorio subir un archivo PDF" });
  }

  // Añadimos 'clasificacion' a la consulta SQL
  const queryInsertar = 'INSERT INTO manuales (nombre, tipo, categoria, clasificacion, archivo_pdf, imagen) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(queryInsertar, [nombre, tipo, categoria, clasificacion, archivoPdf, imagen], (err, resultado) => {
    if (err) {
      console.error("Error al insertar el producto en la BD:", err);
      return res.status(500).json({ message: "Error al guardar en la base de datos" });
    }
    
    res.status(201).json({ 
      message: "Producto y manual guardados correctamente",
      id: resultado.insertId
    });
  });
});

// ==========================================
// RUTA: Eliminar Producto y su PDF
// ==========================================
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;

  const queryBuscar = 'SELECT archivo_pdf FROM manuales WHERE id = ?';
  
  db.query(queryBuscar, [id], (err, resultados) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    if (resultados.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

    const archivoPdf = resultados[0].archivo_pdf;

    if (archivoPdf) {
      const rutaArchivo = path.join(__dirname, 'uploads', 'pdfs', archivoPdf);
      if (fs.existsSync(rutaArchivo)) {
        try {
          fs.unlinkSync(rutaArchivo);
        } catch (errorUnlink) {
          console.error(`No se pudo eliminar el archivo físico ${archivoPdf}:`, errorUnlink);
        }
      }
    }

    const queryEliminar = 'DELETE FROM manuales WHERE id = ?';
    db.query(queryEliminar, [id], (err, resultado) => {
      if (err) return res.status(500).json({ message: "Error al eliminar de la BD" });
      res.status(200).json({ message: "Producto y manual eliminados" });
    });
  });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});