import mongoose from 'mongoose';

const DB_MONGO = process.env.DB_URI || 'mongodb://localhost:27017/db-store';

async function dbConection() {
  try {
    await mongoose.connect(DB_MONGO);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error(error);
    console.error(`Connect Failed! :'(`);
  }

}

export default dbConection;