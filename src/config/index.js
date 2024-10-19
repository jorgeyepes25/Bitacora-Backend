import dotenv from 'dotenv';

dotenv.config();  // Carga las variables de entorno desde el archivo .env

export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  pass: process.env.DB_PASS || 'passwordxd',
  name: process.env.DB_NAME || 'bitacora',
  mongourl: process.env.MONGO_URL || 'mongodb://localhost:27017/bitacora',
};
