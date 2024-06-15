const { app, server } = require('../index');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);
const Espectador = require('../models/espectador.model');
const Producto = require('../models/producto.model');

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

afterAll(() => {
  closeServerAndDBConnection();
});
