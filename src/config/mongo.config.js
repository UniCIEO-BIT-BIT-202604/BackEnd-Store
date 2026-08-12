import mongoose from 'mongoose';
import { dbGetDefaultCategory } from '../services/category.services.js';

const DB_MONGO = process.env.DB_URI || 'mongodb://localhost:27017/db-store';

async function dbConection() {
  try {
    await mongoose.connect(DB_MONGO);
    console.log('Connected to MongoDB Atlas');
    // Inicializar la categoría por defecto si no existe en la base de datos
    await dbGetDefaultCategory();
  } catch (error) {
    console.error(error);
    console.error(`Connect Failed! :'(`);
  }

}

export default dbConection;