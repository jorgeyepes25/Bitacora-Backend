import dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  mongourl: process.env.MONGO_URL || 'mongodb://localhost:27017/bitacora',
};
