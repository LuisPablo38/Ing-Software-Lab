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

  it('Debería obtener clientes filtrados por país', (done) => {
    request(app)
      .get('/clientes?pais=Guatemala')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        if (!Array.isArray(res.body)) throw new Error('La respuesta no es un array');
        if (res.body.length > 0 && res.body.some(cliente => cliente.pais !== 'Guatemala')) {
          throw new Error('No todos los clientes son de Guatemala');
        }
      })
      .end(done);
  });

  //Verificar que el campo opcional puede faltar y no genera error 
  it('Debería permitir la creación de un cliente sin el campo opcional "empresa"', (done) => {
    request(app)
      .post('/clientes')
      .send({
        nombre: "Cliente Sin Empresa",
        email: "cliente.sinempresa@example.com",
        telefono: "+502-1234-5678",
        pais: "Guatemala",
        fechaContacto: "10/23/2024",
        estado: "Nuevo"
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        const cliente = res.body;
        if (cliente.empresa) throw new Error('El campo opcional empresa no debería estar presente');
      })
      .end(done);
  });

  //Actualizar los datos no ingresados antes como la empresa 
  it('Debería actualizar el campo "empresa" de un cliente', (done) => {
    request(app)
      .put(`/clientes/${clienteId}`)
      .send({ empresa: "InnovaTech Actualizada" })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        if (res.body.empresa !== 'InnovaTech Actualizada') throw new Error('El campo empresa no fue actualizado correctamente');
      })
      .end(done);
  });


  it('Debería eliminar un cliente y confirmar que no existe', (done) => {
    request(app)
      .delete(`/clientes/${clienteId}`)
      .expect(200)
      .expect((res) => {
        if (res.body.message !== 'Cliente eliminado.') throw new Error('El mensaje de eliminación no es correcto');
      })
      .end(() => {
        // Confirmar que el cliente eliminado no está disponible
        request(app)
          .get(`/clientes/${clienteId}`)
          .expect(404)
          .expect((res) => {
            if (res.body.error !== 'Cliente no encontrado.') throw new Error('El cliente eliminado debería no estar disponible');
          })
          .end(done);
      });
  });

 



    // Prueba para verificar que no se permite duplicados de correo electrónico DEBE FALLAR 
  it('Debería rechazar la creación de un cliente con correo electrónico duplicado', (done) => {
      const clienteData = {
        nombre: "Pedro Duplicado",
        email: "pedro.duplicado@example.com",
        telefono: "+502-8765-4321",
        empresa: "DupCorp",
        pais: "Guatemala",
        fechaContacto: "10/21/2024",
        estado: "Pendiente"
      };
  
      request(app)
        .post('/clientes')
        .send(clienteData)
        .expect(201)
        .end(() => {
          request(app)
            .post('/clientes')
            .send(clienteData) // Intento de crear otro cliente con el mismo correo
            .expect(400)
            .expect('Content-Type', /json/)
            .expect((res) => {
              if (!res.body.error.includes('Correo electrónico ya registrado')) {
                throw new Error('No se validó el correo duplicado');
              }
            })
            .end(done);
        });
    });

  //No es valido poder ingresar los clientes faltan datos DEBE FALLAR
  it('Debería rechazar crear un cliente con datos incompletos', (done) => {
    request(app)
      .post('/clientes')
      .send({
        nombre: "Cliente Incompleto"
        // Falta el email y otros campos obligatorios
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        if (!res.body.error.includes('Datos incompletos')) throw new Error('No se validó la falta de datos');
      })
      .end(done);
  });
});
