/* SEED PRODUCTOS */
const Producto = require('./models/producto.model');

const productos = [
  {
    nombre: 'Apple iPhone 12 Pro Max',
    precio: 1099,
    descripcion: 'Apple iPhone 12 Pro Max 256GB',
    imagen:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-max-blue-select-2020?wid=940&hei=1112&fmt=png-alpha&.v=1604021662000',
    stock: 10,
    destacado: true,
  },
  {
    nombre: 'Laptop Asus Zenbook',
    precio: 899,
    descripcion: 'Laptop Asus Zenbook 14"',
    imagen:
      'https://www.asus.com/media/global/products/8vlnb0s9q9tqzj3p/P_setting_000_1_90_end_500.png',
    stock: 5,
    destacado: true,
  },
  {
    nombre: 'Samsung Galaxy S21',
    precio: 999,
    descripcion: 'Samsung Galaxy S21 128GB',
    imagen:
      'https://www.samsung.com/pe/smartphones/galaxy-s21-5g/buy/static/images/galaxy-s21-5g-buy-all-colors.jpg',

    stock: 15,
    destacado: false,
  },
  {
    nombre: 'Smartwatch Apple Watch Series 6',
    precio: 399,
    descripcion: 'Smartwatch Apple Watch Series 6 44mm',
    imagen:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MY8L2_VW_34FR+watch-44-alum-spacegray-nc-6s_VW_34FR_WF_CO_GEO_US?wid=750&hei=712&fmt=jpeg&qlt=80&op_usm=0.5,0.5&.v=1604343708000',
    stock: 20,
    destacado: false,
  },
  {
    nombre: 'Laptop HP Pavilion',
    precio: 599,
    descripcion: 'Laptop HP Pavilion 15"',
    imagen:
      'https://store.hp.com/app/assets/images/uploads/prod/HP_Pavilion_Laptop_15t_5.jpg',

    stock: 8,
    destacado: true,
  },
];

const seedProducts = async () => {
  await Producto.deleteMany();
  await Producto.insertMany(productos);
  console.log('Productos creados');
};

/* SEED ESPECTADORES */

const Espectador = require('./models/espectador.model');

const espectadores = [
  {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@email.com',
    dni: '12345678',
  },
  {
    nombre: 'María',
    apellido: 'Gómez',
    email: 'maria@email.com',
    dni: '87654321',
  },
  {
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos@email.com',
    dni: '45678912',
  },
  {
    nombre: 'Ana',
    apellido: 'López',
    email: 'ana@email.com',
    dni: '78912345',
  },
];

let espectadoresGuardados = [];
const seedEspectadores = async () => {
  await Espectador.deleteMany();
  espectadoresGuardados = await Espectador.insertMany(espectadores);
  console.log('Espectadores creados');
};

/* SEED TICKETS */

const Ticket = require('./models/ticket.model');

const tickets = [
  {
    precio: 100,
    categoriaEspectador: 'l',
  },
  {
    precio: 50,
    categoriaEspectador: 'e',
  },
  {
    precio: 75,
    categoriaEspectador: 'l',
  },
  {
    precio: 50,
    categoriaEspectador: 'e',
  },
];

const seedTickets = async () => {
  tickets[0].espectador = espectadoresGuardados[0]._id;
  tickets[1].espectador = espectadoresGuardados[1]._id;
  tickets[2].espectador = espectadoresGuardados[2]._id;
  tickets[3].espectador = espectadoresGuardados[3]._id;

  await Ticket.deleteMany();
  await Ticket.insertMany(tickets);
  console.log('Tickets creados');
};

/* SEED TRANSACCIONES */

const Transaccion = require('./models/transaccion.model');

const transacciones = [
  {
    monedaOrigen: 'USD',
    cantidadOrigen: 100,
    monedaDestino: 'PEN',
    cantidadDestino: 380,
    emailCliente: 'juan@email.com',
    tasaConversion: 3.8,
  },
  {
    monedaOrigen: 'EUR',
    cantidadOrigen: 200,
    monedaDestino: 'ARS',
    cantidadDestino: 20000,
    emailCliente: 'maria@email.com',
    tasaConversion: 100,
  },
  {
    monedaOrigen: 'USD',
    cantidadOrigen: 50,
    monedaDestino: 'PEN',
    cantidadDestino: 190,
    emailCliente: 'carlos@email.com',
    tasaConversion: 3.8,
  },
  {
    monedaOrigen: 'CAD',
    cantidadOrigen: 150,
    monedaDestino: 'BRL',
    cantidadDestino: 600,
    emailCliente: 'ana@email.com',
    tasaConversion: 4,
  },
];

const seedTransacciones = async () => {
  await Transaccion.deleteMany();
  await Transaccion.insertMany(transacciones);
  console.log('Transacciones creadas');
};

const ejecutarSeed = async () => {
  await seedProducts();
  await seedEspectadores();
  await seedTickets();
  await seedTransacciones();
};

const limpiarDB = async () => {
  await Producto.deleteMany();
  await Espectador.deleteMany();
  await Ticket.deleteMany();
  await Transaccion.deleteMany();
};

module.exports = { ejecutarSeed, limpiarDB };
