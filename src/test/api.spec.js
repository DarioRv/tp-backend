const { app, server } = require('../index');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);
const Espectador = require('../models/espectador.model');
const Producto = require('../models/producto.model');
const Ticket = require('../models/ticket.model');
const Transaccion = require('../models/transaccion.model');

const closeServerAndDBConnection = async () => {
  await mongoose.connection.close();
  await server.close();
};

/* Tests espectadores */

const baseUrl = '/api/v1/espectadores';
const espectadoresEjemplo = [
  {
    apellido: 'Pérez',
    nombre: 'José',
    dni: '321361123',
    email: 'jose@email.com',
  },
  {
    apellido: 'Rodriguez',
    nombre: 'Mario',
    dni: '5895489237',
    email: 'mario@email.com',
  },
];

let espectadoresGuardados = [];

describe(`GET ${baseUrl}`, () => {
  beforeEach(async () => {
    await Espectador.deleteMany({});

    const espectador1 = new Espectador(espectadoresEjemplo[0]);
    espectadoresGuardados.push(await espectador1.save());

    const espectador2 = new Espectador(espectadoresEjemplo[1]);
    espectadoresGuardados.push(await espectador2.save());
  });

  test('Debería regresar con todos los espectadores registrados', async () => {
    const response = await request.get(baseUrl);

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(espectadoresEjemplo.length);
  });

  test('Debería regresar un espectador por id', async () => {
    const response = await request.get(
      `${baseUrl}/${espectadoresGuardados[0]._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']._id).toEqual(
      espectadoresGuardados[0]._id.toString()
    );
  });

  afterEach(async () => {
    espectadoresGuardados = [];
    await Espectador.deleteMany({});
  });
});

describe(`POST ${baseUrl}`, () => {
  test('Debería guardar un espectador', async () => {
    const response = await request.post(baseUrl).send(espectadoresEjemplo[0]);

    expect(response.status).toEqual(200);
  });

  test('Debería fallar al recibir body vacío', async () => {
    const response = await request.post(baseUrl).send();

    expect(response.status).toEqual(400);
  });

  test('Debería fallar al recibir objeto con falta de propiedades', async () => {
    const response = await request
      .post(baseUrl)
      .send({ name: 'José', apellido: 'Moca' });

    expect(response.status).toEqual(400);
  });

  afterEach(async () => {
    await Espectador.deleteMany({});
  });
});

describe(`DELETE ${baseUrl}`, () => {
  test('Debería eliminar un espectador por id', async () => {
    const response = await request.post(baseUrl).send(espectadoresEjemplo[0]);

    expect(response.status).toEqual(200);

    const id = response.body['data']._id;
    const resp = await request.delete(`${baseUrl}/${id}`);

    expect(resp.body['data']).toBeTruthy();
  });
});

/* Tests productos */

const baseUrlProductos = '/api/v1/productos';
const productosEjemplo = [
  {
    nombre: 'iPhone 12',
    descripcion:
      'El iPhone 12 es un teléfono inteligente de la marca Apple Inc.',
    imagen: 'iphone.jpg',
    precio: 300,
    stock: 3,
    destacado: true,
  },
  {
    nombre: 'Apple Watch Series 6',
    descripcion:
      'El Apple Watch Series 6 es un reloj inteligente de la marca Apple Inc.',
    imagen: 'watch.jpg',
    precio: 100,
    stock: 10,
    destacado: false,
  },
  {
    nombre: 'MacBook Pro',
    descripcion:
      'La MacBook Pro es una línea de computadoras portátiles de la marca Apple Inc.',
    imagen: 'macbook.jpg',
    precio: 200,
    stock: 5,
    destacado: true,
  },
];
let productosGuardados = [];

describe(`GET ${baseUrlProductos}`, () => {
  beforeEach(async () => {
    await Producto.deleteMany({});

    for (const producto of productosEjemplo) {
      const productoGuardado = await Producto.create(producto);
      productosGuardados.push(productoGuardado);
    }
  });

  test('Debería regresar todos los productos', async () => {
    const response = await request.get(baseUrlProductos);

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(productosEjemplo.length);
  });

  afterEach(async () => {
    productosGuardados = [];
    await Producto.deleteMany({});
  });
});

describe(`GET ${baseUrlProductos}/featured`, () => {
  beforeEach(async () => {
    await Producto.deleteMany({});

    for (const producto of productosEjemplo) {
      const productoGuardado = await Producto.create(producto);
      productosGuardados.push(productoGuardado);
    }
  });

  test('Debería regresar con los productos destacados', async () => {
    const response = await request.get(`${baseUrlProductos}/featured`);

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(2);
  });

  afterEach(async () => {
    productosGuardados = [];
    await Producto.deleteMany({});
  });
});

describe(`POST ${baseUrlProductos}`, () => {
  test('Debería guardar un producto', async () => {
    const response = await request
      .post(baseUrlProductos)
      .send(productosEjemplo[0]);

    expect(response.status).toBe(201);
    expect(response.body['data']).toBeTruthy();
  });
});

describe(`PATCH ${baseUrlProductos}`, () => {
  test('Debería actualizar un producto', async () => {
    const productoGuardado = await Producto.create(productosEjemplo[0]);
    const productoActualizado = {
      ...productoGuardado.toObject(),
      nombre: 'iPhone 13',
    };

    const response = await request
      .patch(baseUrlProductos)
      .send(productoActualizado);

    expect(response.status).toBe(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data'].nombre).toBe(productoActualizado.nombre);
  });

  test('Debería fallar al actualizar un producto con id inexistente', async () => {
    const response = await request
      .patch(baseUrlProductos)
      .send({ ...productosGuardados[0], _id: '123' });

    expect(response.status).toBe(404);
  });

  afterEach(async () => {
    await Producto.deleteMany({});
  });
});

describe(`DELETE ${baseUrlProductos}`, () => {
  test('Debería eliminar un producto por id', async () => {
    const producto = {
      nombre: 'iPhone 12',
      descripcion:
        'El iPhone 12 es un teléfono inteligente de la marca Apple Inc.',
      imagen: 'iphone.jpg',
      precio: 300,
      stock: 3,
      destacado: true,
    };

    const productoGuardado = await Producto.create(producto);

    const response = await request.delete(
      `${baseUrlProductos}/${productoGuardado._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body['data']).toBeTruthy();
  });

  test('Debería fallar al eliminar un producto con id inexistente', async () => {
    const response = await request.delete(`${baseUrlProductos}/dafasdd123a@`);

    expect(response.status).toBe(404);
  });
});

/* Tests de tickets */

const baseUrlTickets = '/api/v1/tickets';

const ticketsEjemplo = [
  {
    precio: 100,
    categoriaEspectador: 'e',
  },
  {
    precio: 200,
    categoriaEspectador: 'l',
  },
  {
    precio: 300,
    categoriaEspectador: 'e',
  },
];
let ticketsGuardados = [];

describe(`GET ${baseUrlTickets}`, () => {
  beforeEach(async () => {
    await Ticket.deleteMany({});
    await Espectador.deleteMany({});

    for (const ticket of ticketsEjemplo) {
      const espectadorGuardado = await Espectador.create(
        espectadoresEjemplo[0]
      );
      const ticketGuardado = await Ticket.create({
        ...ticket,
        espectador: espectadorGuardado._id,
      });
      ticketsGuardados.push(ticketGuardado);
    }
  });

  test('Debería regresar todos los tickets', async () => {
    const response = await request.get(baseUrlTickets);

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(ticketsEjemplo.length);
  });

  test('Debería regresar todos los tickets de categoría extranjero', async () => {
    const response = await request.get(`${baseUrlTickets}?categoria=e`);

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(
      structuredClone(ticketsEjemplo).filter(
        (e) => e.categoriaEspectador == 'e'
      ).length
    );
  });

  test('Debería regresar todos los tickets de categoría local', async () => {
    const response = await request.get(`${baseUrlTickets}?categoria=l`);

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(
      structuredClone(ticketsEjemplo).filter(
        (e) => e.categoriaEspectador == 'l'
      ).length
    );
  });

  afterEach(async () => {
    await Ticket.deleteMany({});
    await Espectador.deleteMany({});
  });
});

describe(`POST ${baseUrlTickets}`, () => {
  test('Debería guardar un ticket', async () => {
    const espectadorGuardado = await Espectador.create(espectadoresEjemplo[0]);

    const response = await request
      .post(baseUrlTickets)
      .send({ ...ticketsEjemplo[0], espectador: espectadorGuardado._id });

    expect(response.status).toBe(201);
    expect(response.body['data']).toBeTruthy();
  });

  test('Debería fallar al recibir body vacío', async () => {
    const response = await request.post(baseUrlTickets).send();

    expect(response.status).toBe(400);
  });

  test('Debería fallar al recibir objeto con falta de propiedades', async () => {
    const response = await request.post(baseUrlTickets).send({ precio: 100 });

    expect(response.status).toBe(400);
  });

  afterEach(async () => {
    await Ticket.deleteMany({});
    await Espectador.deleteMany({});
  });
});

describe(`PATCH ${baseUrlTickets}`, () => {
  test('Debería actualizar un ticket', async () => {
    const espectadorGuardado = await Espectador.create(espectadoresEjemplo[0]);
    const ticketGuardado = await Ticket.create({
      ...ticketsEjemplo[0],
      espectador: espectadorGuardado._id,
    });
    const ticketActualizado = {
      ...ticketGuardado.toObject(),
      precio: 900,
    };

    const response = await request
      .patch(baseUrlTickets)
      .send(ticketActualizado);

    expect(response.status).toBe(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data'].precio).toBe(ticketActualizado.precio);
  });

  test('Debería fallar al actualizar un ticket con id inexistente', async () => {
    const response = await request
      .patch(baseUrlTickets)
      .send({ ...ticketsGuardados[0], _id: '123' });

    expect(response.status).toBe(404);
  });

  afterEach(async () => {
    await Ticket.deleteMany({});
    await Espectador.deleteMany({});
  });
});

describe(`DELETE ${baseUrlTickets}`, () => {
  test('Debería eliminar un ticket por id', async () => {
    const espectadorGuardado = await Espectador.create(espectadoresEjemplo[0]);
    const ticketGuardado = await Ticket.create({
      ...ticketsEjemplo[0],
      espectador: espectadorGuardado._id,
    });

    const response = await request.delete(
      `${baseUrlTickets}/${ticketGuardado._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body['data']).toBeTruthy();
  });

  test('Debería fallar al eliminar un ticket con id inexistente', async () => {
    const response = await request.delete(`${baseUrlTickets}/dafasdd123a@`);

    expect(response.status).toBe(404);
  });

  afterEach(async () => {
    await Ticket.deleteMany({});
    await Espectador.deleteMany({});
  });
});

/* Tests de transacciones */

const baseUrlTransacciones = '/api/v1/transacciones';

const transaccionesEjemplo = [
  {
    monedaOrigen: 'USD-EEUU',
    cantidadOrigen: 100,
    monedaDestino: 'PEN-PERU',
    cantidadDestino: 380,
    emailCliente: 'juan@email.com',
    tasaConversion: 3.8,
  },
  {
    monedaOrigen: 'ARS-ARGENTINA',
    cantidadOrigen: 20000,
    monedaDestino: 'PEN',
    cantidadDestino: 10000,
    emailCliente: 'pedro@email.com',
    tasaConversion: 0.5,
  },
  {
    monedaOrigen: 'BRL-BRASIL',
    cantidadOrigen: 30,
    monedaDestino: 'USD-EEUU',
    cantidadDestino: 5,
    emailCliente: 'neymar@email.com',
    tasaConversion: 0.16,
  },
];
let transaccionesGuardadas = [];

describe(`GET ${baseUrlTransacciones}`, () => {
  beforeEach(async () => {
    await Transaccion.deleteMany({});

    for (const transaccion of transaccionesEjemplo) {
      const transaccionGuardada = await Transaccion.create(transaccion);
      transaccionesGuardadas.push(transaccionGuardada);
    }
  });

  test('Debería regresar todas las transacciones', async () => {
    const response = await request.get(baseUrlTransacciones);

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(transaccionesEjemplo.length);
  });

  test('Debería regresar todas las transacciones de un cliente', async () => {
    const response = await request.get(
      `${baseUrlTransacciones}?emailCliente=${transaccionesEjemplo[0].emailCliente}`
    );

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(
      structuredClone(transaccionesEjemplo).filter(
        (e) => e.emailCliente == transaccionesEjemplo[0].emailCliente
      ).length
    );
  });

  test('Debería regresar todas las transacciones de una moneda a otra', async () => {
    const response = await request.get(
      `${baseUrlTransacciones}?monedaOrigen=${transaccionesEjemplo[0].monedaOrigen}&monedaDestino=${transaccionesEjemplo[0].monedaDestino}`
    );

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(
      structuredClone(transaccionesEjemplo).filter(
        (e) =>
          e.monedaOrigen == transaccionesEjemplo[0].monedaOrigen &&
          e.monedaDestino == transaccionesEjemplo[0].monedaDestino
      ).length
    );
  });

  afterEach(async () => {
    transaccionesGuardadas = [];
    await Transaccion.deleteMany({});
  });
});

describe(`POST ${baseUrlTransacciones}`, () => {
  test('Debería guardar una transacción', async () => {
    const response = await request
      .post(baseUrlTransacciones)
      .send(transaccionesEjemplo[0]);

    expect(response.status).toBe(201);
    expect(response.body['data']).toBeTruthy();
  });
});

afterAll(() => {
  closeServerAndDBConnection();
});
