import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

import mongoose from 'mongoose';

const LOCAL_STRING_CONNECTION = 'mongodb://localhost:27017/db-store';

async function dbConection() {
  try {
    await mongoose.connect(LOCAL_STRING_CONNECTION);
    console.log('Connected to local MongoDB');
  } catch (error) {
    console.error(error);
    console.error("Connect Failed! :'(");
  }
}

export default dbConection;