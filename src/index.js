const express = require('express');
const cors = require('cors');

const espectadorRouter = require('./routes/espectador.route');
const productoRouter = require('./routes/producto.route');
const ticketRouter = require('./routes/ticket.route');
const transaccionRouter = require('./routes/transaccion.route');
const { ejecutarSeed, limpiarDB } = require('./seed');
const connectToDB = require('./config/mongo.config');
const PORT = 3000;

/* --- */

connectToDB();
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.use('/api/v1/espectadores', espectadorRouter);
app.use('/api/v1/productos', productoRouter);
app.use('/api/v1/tickets', ticketRouter);
app.use('/api/v1/transacciones', transaccionRouter);

app.get('/', async (req, res) => {
  res.json('Bienvenido a mi primer RESTful API');
});

app.use('/api/v1/seed', async (req, res) => {
  await ejecutarSeed();
  res.json({ data: 'Base de datos rellenada con datos de prueba' });
});

app.use('/api/v1/clean', async (req, res) => {
  await limpiarDB();
  res.json({ data: 'Base de datos limpiada' });
});

/* --- */

const server = app.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto: http://localhost:' + PORT);
});

module.exports = { app, server }; // -> MIDU DIOS
