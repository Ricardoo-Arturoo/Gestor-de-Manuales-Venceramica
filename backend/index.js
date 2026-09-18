require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path'); 
const fs = require('fs');
const multer = require('multer');

// 1. IMPORTAR BCRYPT
const bcrypt = require('bcrypt');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// ==========================================
// CONEXIÓN A MYSQL (POOL OPTIMIZADO)
// ==========================================
const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,        
  keepAliveInitialDelay: 10000   
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('¡Conectado exitosamente a la base de datos MySQL mediante Pool!');
    connection.release();
  } catch (err) {
    console.error('Error conectando a la base de datos:', err);
  }
})();

app.get('/', (req, res) => {
  res.send('API Backend de Manuales Venceramica en funcionamiento');
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
// RUTA: Crear Usuario (NUEVA - Necesaria para encriptar la primera vez)
// ==========================================
app.post('/api/usuarios', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 2. HASHEAR LA CONTRASEÑA ANTES DE GUARDARLA
    // El '10' es el número de rondas de seguridad (salt rounds)
    const hashPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO usuarios (name, email, password, role) VALUES (?, ?, ?, ?)';
    await db.query(query, [name, email, hashPassword, role || 'usuario']);

    res.status(201).json({ message: 'Usuario creado exitosamente con contraseña segura' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
});


// ==========================================
// RUTA: Login (MODIFICADA PARA LEER HASH)
// ==========================================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 3. BUSCAR AL USUARIO SOLO POR EMAIL (no podemos buscar por password directamente)
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  
  try {
    const [results] = await db.query(query, [email]);

    // Si el correo no existe en la base de datos
    if (results.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const user = results[0];

    // 4. COMPARAR LA CONTRASEÑA ENVIADA CON EL HASH GUARDADO
    // bcrypt.compare toma la contraseña limpia y el hash de la BD y verifica si coinciden
    const contrasenaValida = await bcrypt.compare(password, user.password);

    if (contrasenaValida) {
      // 5. ACCESO CONCEDIDO
      res.status(200).json({
        message: 'Login exitoso',
        user: { name: user.name, email: user.email, role: user.role }
      });
    } else {
      // CONTRASEÑA INCORRECTA
      res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
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
app.get('/api/productos/:categoria', async (req, res) => {
  const categoria = req.params.categoria;
  const sql = 'SELECT * FROM manuales WHERE categoria = ?';
  
  try {
    const [resultados] = await db.query(sql, [categoria]);
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// ==========================================
// RUTA: Crear Producto y Subir PDF
// ==========================================
app.post('/api/productos', upload.single('pdf'), async (req, res) => {
  const { nombre, tipo, categoria, clasificacion } = req.body;
  const archivoPdf = req.file ? req.file.filename : null;
  const imagen = 'default.png'; 

  if (!archivoPdf) {
    return res.status(400).json({ message: "Es obligatorio subir un archivo PDF" });
  }

  const queryInsertar = 'INSERT INTO manuales (nombre, tipo, categoria, clasificacion, archivo_pdf, imagen) VALUES (?, ?, ?, ?, ?, ?)';
  
  try {
    const [resultado] = await db.query(queryInsertar, [nombre, tipo, categoria, clasificacion, archivoPdf, imagen]);
    res.status(201).json({ 
      message: "Producto y manual guardados correctamente",
      id: resultado.insertId
    });
  } catch (err) {
    console.error("Error al insertar el producto en la BD:", err);
    res.status(500).json({ message: "Error al guardar en la base de datos" });
  }
});

// ==========================================
// RUTA: Eliminar Producto y su PDF
// ==========================================
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const queryBuscar = 'SELECT archivo_pdf FROM manuales WHERE id = ?';
  
  try {
    const [resultados] = await db.query(queryBuscar, [id]);
    
    if (resultados.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

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
    await db.query(queryEliminar, [id]);
    res.status(200).json({ message: "Producto y manual eliminados" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en la base de datos" });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});