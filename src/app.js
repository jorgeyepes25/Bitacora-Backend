import express from 'express';
import morgan from 'morgan';  
import cors from 'cors'; 
import routes from './routes/index.js';
import { connectDB } from './database/conexion.js';

const port = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(morgan('dev')); 
app.use(express.json());
app.use(cors()); 

// Ruta principal
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});