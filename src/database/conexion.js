import mongoose from 'mongoose';
import { databaseConfig } from './config.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb://${databaseConfig.host}/${databaseConfig.name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: databaseConfig.user,
      pass: databaseConfig.pass
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
