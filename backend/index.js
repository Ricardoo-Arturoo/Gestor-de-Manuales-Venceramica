require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); 
const fs = require('fs');
const multer = require('multer'); // <-- NUEVO: Importamos multer

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
    // La carpeta donde se guardarán los archivos
    cb(null, path.join(__dirname, 'uploads', 'pdfs'));
  },
  filename: (req, file, cb) => {
    // Le damos un nombre único al archivo agregando la fecha para que no se sobreescriban
    const prefijoUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Limpiamos los espacios en blanco del nombre original
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
  // CAMBIO EN LA CONSULTA: users por usuarios
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
  // CAMBIO EN LA CONSULTA: productos por manuales
  const sql = 'SELECT * FROM manuales WHERE categoria = ?';
  
  db.query(sql, [categoria], (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.json(resultados);
  });
});

// ==========================================
// NUEVA RUTA: Crear Producto y Subir PDF
// ==========================================
// Usamos 'upload.single("pdf")' porque en Vue llamamos a nuestro archivo 'pdf' en el FormData
app.post('/api/productos', upload.single('pdf'), (req, res) => {
  // req.file contiene la información del PDF que subió multer
  // req.body contiene los campos de texto (nombre, tipo, categoria)
  
  const { nombre, tipo, categoria } = req.body;
  
  // Si multer guardó el archivo correctamente, tomamos el nombre que le asignó
  const archivoPdf = req.file ? req.file.filename : null;
  
  // Si en tu BD tienes una columna 'imagen', puedes asignarle un valor por defecto
  const imagen = 'default.png'; // Reemplaza esto si usas una lógica diferente para imágenes

  if (!archivoPdf) {
    return res.status(400).json({ message: "Es obligatorio subir un archivo PDF" });
  }

  // CAMBIO EN LA CONSULTA: productos por manuales
  const queryInsertar = 'INSERT INTO manuales (nombre, tipo, categoria, archivo_pdf, imagen) VALUES (?, ?, ?, ?, ?)';
  
  db.query(queryInsertar, [nombre, tipo, categoria, archivoPdf, imagen], (err, resultado) => {
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

  // CAMBIO EN LA CONSULTA: productos por manuales
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

    // CAMBIO EN LA CONSULTA: productos por manuales
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