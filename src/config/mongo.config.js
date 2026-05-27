import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

import mongoose from 'mongoose';

// | Parte      | Significado                                      |
// | ---------- | ------------------------------------------------ |
// | mongodb:// | Protocolo de conexión stackoverflow              |
// | localhost  | Servidor (tu propia computadora) stackoverflow+1 |
// | 27017      | Puerto por defecto de MongoDB stackoverflow+1    |
// | db-store   | Nombre de la base de datos stackoverflow         |

const LOCAL_STRING_CONNECTION = 'mongodb://localhost:27017/db-store';

async function dbConection() {


//   async = función asíncrona que puede esperar operaciones que tardan (como conectarse a una BD)

// dbConection = nombre de la función (nota: hay un typo, es "Connection" no "Conection")
  try {
    await mongoose.connect(LOCAL_STRING_CONNECTION);

//   try = bloque que intenta ejecutar código que puede fallar

// await = espera a que la conexión termine antes de seguir

// mongoose.connect() = función que inicia la conexión


    console.log('Connected to local MongoDB');
  } catch (error) {
    console.error(error);
    console.error("Connect Failed! :'(");
  }
}

export default dbConection;