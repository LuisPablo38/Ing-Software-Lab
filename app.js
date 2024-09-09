const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname)));

let clientes = []; // Array para almacenar los clientes

// Función para validar el formato de correo
function validarCorreo(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar el formato del número de teléfono
function validarTelefono(telefono) {
    const regex = /^\+\d{1,3}-\d{4}-\d{4}$/;
    return regex.test(telefono);
}

// Función para validar el país
const paisesValidos = ['Guatemala', 'Estados Unidos', 'México']; // Lista de ejemplo
function validarPais(pais) {
    return paisesValidos.includes(pais);
}

// Función para validar el estado del cliente
const estadosValidos = ['Nuevo', 'En negociación', 'Ganado', 'Perdido'];
function validarEstado(estado) {
    return estadosValidos.includes(estado);
}

// Función para validar la fecha
function validarFecha(fecha) {
    const date = new Date(fecha);
    return !isNaN(date.getTime()) && date <= new Date();
}

// Endpoint para crear un cliente
app.post('/clientes', (req, res) => {
    const { nombre, email, telefono, empresa, pais, fechaContacto, estado } = req.body;

    // Validaciones
    if (!nombre || nombre.length < 3 || nombre.length > 100) {
        return res.status(400).json({ error: 'Nombre inválido.' });
    }
    if (!validarCorreo(email)) {
        return res.status(400).json({ error: 'Correo electrónico inválido.' });
    }
    if (!validarTelefono(telefono)) {
        return res.status(400).json({ error: 'Teléfono inválido.' });
    }
    if (!validarPais(pais)) {
        return res.status(400).json({ error: 'País inválido.' });
    }
    if (!validarFecha(fechaContacto)) {
        return res.status(400).json({ error: 'Fecha de contacto inválida.' });
    }
    if (!validarEstado(estado)) {
        return res.status(400).json({ error: 'Estado inválido.' });
    }

    const nuevoCliente = { id: clientes.length + 1, nombre, email, telefono, empresa, pais, fechaContacto, estado };
    clientes.push(nuevoCliente);
    res.status(201).json(nuevoCliente);
});

// Endpoint para obtener todos los clientes
app.get('/clientes', (req, res) => {
    res.json(clientes);
});

// Endpoint para obtener un cliente específico por ID
app.get('/clientes/:id', (req, res) => {
    const cliente = clientes.find(c => c.id === parseInt(req.params.id));
    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado.' });
    }
    res.json(cliente);
});

// Endpoint para actualizar un cliente
app.put('/clientes/:id', (req, res) => {
    const cliente = clientes.find(c => c.id === parseInt(req.params.id));
    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    const { nombre, email, telefono, empresa, pais, fechaContacto, estado } = req.body;

    if (nombre && (nombre.length < 3 || nombre.length > 100)) {
        return res.status(400).json({ error: 'Nombre inválido.' });
    }
    if (email && !validarCorreo(email)) {
        return res.status(400).json({ error: 'Correo electrónico inválido.' });
    }
    if (telefono && !validarTelefono(telefono)) {
        return res.status(400).json({ error: 'Teléfono inválido.' });
    }
    if (pais && !validarPais(pais)) {
        return res.status(400).json({ error: 'País inválido.' });
    }
    if (fechaContacto && !validarFecha(fechaContacto)) {
        return res.status(400).json({ error: 'Fecha de contacto inválida.' });
    }
    if (estado && !validarEstado(estado)) {
        return res.status(400).json({ error: 'Estado inválido.' });
    }

    // Actualización
    if (nombre) cliente.nombre = nombre;
    if (email) cliente.email = email;
    if (telefono) cliente.telefono = telefono;
    if (empresa) cliente.empresa = empresa;
    if (pais) cliente.pais = pais;
    if (fechaContacto) cliente.fechaContacto = fechaContacto;
    if (estado) cliente.estado = estado;

    res.json(cliente);
});

// Endpoint para eliminar un cliente por ID
app.delete('/clientes/:id', (req, res) => {
    const clienteIndex = clientes.findIndex(c => c.id === parseInt(req.params.id));
    if (clienteIndex === -1) {
        return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    clientes.splice(clienteIndex, 1);
    res.status(204).send();
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
