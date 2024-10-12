# Sistema de Gestión de Clientes

Este proyecto es una API simple basada en **Node.js** y **Express** que permite gestionar un conjunto de clientes. Se puede crear, actualizar, eliminar y obtener información de los clientes, validando varios campos antes de realizar las operaciones.

## Características

- CRUD completo (Crear, Leer, Actualizar, Eliminar) para gestionar clientes.
- Validación de campos como nombre, correo electrónico, teléfono, país, fecha de contacto y estado del cliente.
- Utiliza JSON para el intercambio de datos.
- Manejo de errores con respuestas HTTP adecuadas.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express**: Framework minimalista para Node.js que facilita la creación de APIs.
- **body-parser**: Middleware para procesar cuerpos de solicitudes en formato JSON.
- **path**: Módulo para gestionar rutas de archivos.

## Endpoints

### 1. **Crear un cliente**
   - **Método**: `POST /clientes`
   - **Descripción**: Permite crear un nuevo cliente, validando todos los campos antes de su inserción.
   - **Parámetros** (en el cuerpo de la solicitud):
     - `nombre`: Nombre del cliente (mínimo 3 y máximo 100 caracteres).
     - `email`: Correo electrónico válido.
     - `telefono`: Número de teléfono con el formato `+<código de país>-<4 dígitos>-<4 dígitos>`.
     - `empresa`: Nombre de la empresa del cliente.
     - `pais`: País del cliente (solo se aceptan "Guatemala", "Estados Unidos", y "México").
     - `fechaContacto`: Fecha en formato válido (no puede ser futura).
     - `estado`: Estado del cliente (solo se aceptan "Nuevo", "En negociación", "Ganado", "Perdido").
   - **Respuesta**: El cliente creado con su ID asignado.

### 2. **Obtener todos los clientes**
   - **Método**: `GET /clientes`
   - **Descripción**: Obtiene una lista de todos los clientes.
   - **Respuesta**: Un array de objetos JSON con la información de cada cliente.

### 3. **Obtener un cliente por ID**
   - **Método**: `GET /clientes/:id`
   - **Descripción**: Obtiene un cliente específico por su ID.
   - **Respuesta**: El cliente encontrado o un error 404 si no existe.

### 4. **Actualizar un cliente**
   - **Método**: `PUT /clientes/:id`
   - **Descripción**: Permite actualizar los datos de un cliente existente. Se validan los campos proporcionados en la solicitud.
   - **Parámetros** (en el cuerpo de la solicitud):
     - Cualquiera de los campos aceptados en el endpoint de creación.
   - **Respuesta**: El cliente actualizado o un error 404 si no existe.

### 5. **Eliminar un cliente**
   - **Método**: `DELETE /clientes/:id`
   - **Descripción**: Elimina un cliente existente por su ID.
   - **Respuesta**: Un mensaje confirmando la eliminación o un error 404 si no existe.

## Validaciones

- **Correo electrónico**: Debe tener un formato válido (`example@domain.com`).
- **Teléfono**: Debe seguir el formato `+<código de país>-<4 dígitos>-<4 dígitos>`.
- **País**: Solo se aceptan los países "Guatemala", "Estados Unidos", y "México".
- **Fecha de contacto**: Debe ser una fecha válida y no puede estar en el futuro.
- **Estado**: Solo se aceptan los estados "Nuevo", "En negociación", "Ganado", "Perdido".

## Iniciar el servidor

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor:
   ```bash
   npm start
   ```

El servidor estará disponible en `http://localhost:3000`.

## Ejemplos de uso

### Crear un cliente

```bash
curl -X POST http://localhost:3000/clientes -H "Content-Type: application/json" -d '{
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "+502-1234-5678",
  "empresa": "Compañía XYZ",
  "pais": "Guatemala",
  "fechaContacto": "2023-09-10",
  "estado": "Nuevo"
}'
```

### Obtener todos los clientes

```bash
curl -X GET http://localhost:3000/clientes
```

### Obtener un cliente por ID

```bash
curl -X GET http://localhost:3000/clientes/1
```

### Actualizar un cliente

```bash
curl -X PUT http://localhost:3000/clientes/1 -H "Content-Type: application/json" -d '{
  "nombre": "Juan Actualizado",
  "email": "juan.actualizado@example.com"
}'
```

### Eliminar un cliente

```bash
curl -X DELETE http://localhost:3000/clientes/1
```

## Notas

- El archivo `clientes` es un arreglo en memoria, lo que significa que los datos se pierden cuando se reinicia el servidor.
- Para utilizar en un entorno de producción, deberías conectar esta API a una base de datos persistente.

--- 
