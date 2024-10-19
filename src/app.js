import express from 'express';
import morgan from 'morgan';  
import cors from 'cors'; 
import { serverConfig } from './config/index.js'; 

const app = express();

// Middlewares
app.use(morgan('dev')); 
app.use(express.json());
app.use(cors()); 

// Ruta principal
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = serverConfig.port;

// Servidor escuchando
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
