const express = require('express');
const cors = require('cors');

const espectadorRouter = require('./routes/espectador.route');
const productoRouter = require('./routes/producto.route');
const connectToDB = require('./config/mongo.config');
import { PORT } from './config/config';

/* --- */

connectToDB();
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.use('/api/v1/espectadores', espectadorRouter);
app.use('/api/v1/productos', productoRouter);

app.get('/', async (req, res) => {
  res.send('Bienvenido a mi primer RESTful API');
});

/* --- */

const server = app.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto: http://localhost:' + PORT);
});

module.exports = { app, server }; // -> MIDU DIOS
