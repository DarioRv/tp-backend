const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tp-back';

async function connectToDatabase() {
  try {
    await mongoose.connect(URI);
    console.log('Conexión exitosa con la base de datos');
  } catch (err) {
    console.error('Error de conexión con la base de datos:', err);
    throw new Error('Error de conexión con la base de datos');
  }
}

module.exports = connectToDatabase;
