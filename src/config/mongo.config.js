const mongoose = require('mongoose');
import { MONGO_URL } from './config';

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Conexión exitosa con la base de datos');
  } catch (err) {
    console.error('Error de conexión con la base de datos:', err);
    throw new Error('Error de conexión con la base de datos');
  }
}

module.exports = connectToDatabase;
