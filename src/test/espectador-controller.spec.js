const { app, server } = require('../index');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);
const Espectador = require('../models/espectador.model');

const closeServerAndDBConnection = () => {
  mongoose.connection.close();
  server.close();
};

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

describe(`GET ${baseUrl}`, () => {
  beforeEach(async () => {
    await Espectador.deleteMany({});

    const espectador1 = new Espectador(espectadoresEjemplo[0]);
    await espectador1.save();

    const espectador2 = new Espectador(espectadoresEjemplo[1]);
    await espectador2.save();
  });

  test('Debería regresar con todos los espectadores registrados', async () => {
    const response = await request.get(baseUrl);

    expect(response.status).toEqual(200);
    expect(response.body['data']).toBeTruthy();
    expect(response.body['data']).toHaveLength(espectadoresEjemplo.length);
  });

  afterEach(async () => {
    await Espectador.deleteMany({});
  });
});

describe(`POST ${baseUrl}`, () => {
  test('Debería guardar un espectador', async () => {
    const response = await request.post(baseUrl).send(espectadoresEjemplo[0]);

    expect(response.status).toEqual(200);
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

afterAll(() => {
  closeServerAndDBConnection();
});