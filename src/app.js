import express from 'express';
import morgan from 'morgan';  
import cors from 'cors'; 
import passport from 'passport';
import routes from './routes/index.js';
import { connectDB } from './database/conexion.js';
import './config/passport.js';  // Cargar configuración de Passport

const port = process.env.PORT || 3000;
const app = express();

// Conectar a la base de datos antes de iniciar el servidor
connectDB();

// Inicializar Passport sin sesiones
app.use(passport.initialize());

// Middlewares
app.use(morgan('dev')); 
app.use(express.json());
app.use(cors()); 

// Ruta principal
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use('/api', routes);

// Servidor escuchando
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
