const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
  precio: { type: Number, required: true },
  categoriaEspectador: { type: String, required: true },
  espectador: { type: Schema.ObjectId, ref: 'Espectador' },
});

module.exports = mongoose.model('Ticket', ticketSchema);
