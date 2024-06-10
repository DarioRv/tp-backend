const mongoose = require('mongoose');
const { Schema } = mongoose;

const espectadorSchema = new Schema({
  apellido: { type: String, required: true },
  nombre: { type: String, required: true },
  dni: { type: String, required: true },
  email: { type: String, required: true },
});

const Espectador = mongoose.model('Espectador', espectadorSchema);
module.exports = Espectador;
