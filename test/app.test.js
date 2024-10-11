const request = require('supertest');
const app = require('../app');

describe('API Clientes Test Suite', () => {
  let clienteId;

  // Prueba para crear un cliente correctamente
  it('Debería crear un cliente correctamente', (done) => {
    request(app)
      .post('/clientes')
      .send({
        nombre:"Juan Perez",
        email:"pedro@gmail.com", 
        telefono:"+502-5855-8408", 
        empresa:"Bi",
        pais:"Guatemala", 
        fechaContacto:"9/11/2024", 
        estado:"Nuevo" 
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        const cliente = res.body;
        if (!cliente.id) throw new Error('Falta el ID');
        if (cliente.nombre !== 'Juan Perez') throw new Error('Nombre incorrecto');
        clienteId = cliente.id; // Guardar el ID para futuras pruebas
      })
      .end(done);
  });

  // Prueba para validar que el cliente fue creado y se puede obtener
  it('Debería obtener el cliente creado por su ID', (done) => {
    request(app)
      .get(`/clientes/${clienteId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        const cliente = res.body;
        if (cliente.nombre !== 'Juan Perez') throw new Error('Nombre incorrecto');
        if (cliente.email !== 'pedro@gmail.com') throw new Error('Correo incorrecto');
      })
      .end(done);
  });

  // Prueba para actualizar un cliente
  it('Debería actualizar el nombre del cliente', (done) => {
    request(app)
      .put(`/clientes/${clienteId}`)
      .send({
        nombre: 'Juan Actualizado'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        if (res.body.nombre !== 'Juan Actualizado') throw new Error('El nombre no fue actualizado correctamente');
      })
      .end(done);
  });

  // Prueba para validar la lista de clientes
  it('Debería obtener todos los clientes', (done) => {
    request(app)
      .get('/clientes')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        if (!Array.isArray(res.body)) throw new Error('La respuesta no es un array');
        if (res.body.length === 0) throw new Error('No hay clientes en la respuesta');
      })
      .end(done);
  });

  // Prueba para eliminar el cliente
  it('Debería eliminar el cliente por ID', (done) => {
    request(app)
      .delete(`/clientes/${clienteId}`)
      .expect(200)
      .expect((res) => {
        if (res.body.message !== 'Cliente eliminado.') throw new Error('El cliente no fue eliminado correctamente');
      })
      .end(done);
  });

  // Prueba para validar que el cliente eliminado no exista
  it('Debería retornar un 404 para un cliente no encontrado', (done) => {
    request(app)
      .get(`/clientes/${clienteId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        if (res.body.error !== 'Cliente no encontrado.') throw new Error('Error no detectado correctamente');
      })
      .end(done);
  });
});
