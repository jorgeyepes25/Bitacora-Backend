import dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'opensim',
  pass: process.env.DB_PASS || 'passwordxd',
  name: process.env.DB_NAME || 'MQTT',
};

export const serverConfig = {
  port: process.env.PORT || 3000
};
