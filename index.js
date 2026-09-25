const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos temporal en memoria
let servicios = [
  { id: 1, nombre: 'Desarrollo Web', precio: 1500000, estado: 'Activo' },
  { id: 2, nombre: 'Mantenimiento de Software', precio: 500000, estado: 'Activo' }
];

// 1. GET: Obtener todos los servicios
app.get('/api/servicios', (req, res) => {
  res.status(200).json({
    ok: true,
    data: servicios
  });
});

// 2. GET: Obtener un servicio por ID
app.get('/api/servicios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const servicio = servicios.find(s => s.id === id);

  if (!servicio) {
    return res.status(404).json({ ok: false, mensaje: 'Servicio no encontrado' });
  }

  res.status(200).json({ ok: true, data: servicio });
});

// 3. POST: Crear un nuevo servicio (con validación de entrada)
app.post('/api/servicios', (req, res) => {
  const { nombre, precio, estado } = req.body;

  // Validacion de campos obligatorios
  if (!nombre || !precio) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El nombre y el precio son obligatorios'
    });
  }

  const nuevoServicio = {
    id: servicios.length ? servicios[servicios.length - 1].id + 1 : 1,
    nombre,
    precio,
    estado: estado || 'Activo'
  };

  servicios.push(nuevoServicio);
  res.status(201).json({ ok: true, mensaje: 'Servicio creado exitosamente', data: nuevoServicio });
});

// 4. PUT: Actualizar un servicio existente
app.put('/api/servicios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, precio, estado } = req.body;

  const indice = servicios.findIndex(s => s.id === id);

  if (indice === -1) {
    return res.status(404).json({ ok: false, mensaje: 'Servicio no encontrado' });
  }

  servicios[indice] = {
    ...servicios[indice],
    nombre: nombre || servicios[indice].nombre,
    precio: precio || servicios[indice].precio,
    estado: estado || servicios[indice].estado
  };

  res.status(200).json({ ok: true, mensaje: 'Servicio actualizado correctamente', data: servicios[indice] });
});

// 5. DELETE: Eliminar un servicio
app.delete('/api/servicios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const servicioExiste = servicios.some(s => s.id === id);

  if (!servicioExiste) {
    return res.status(404).json({ ok: false, mensaje: 'Servicio no encontrado' });
  }

  servicios = servicios.filter(s => s.id !== id);
  res.status(200).json({ ok: true, mensaje: 'Servicio eliminado exitosamente' });
});

// Ruta raiz
app.get('/', (req, res) => {
  res.send('API REST de Servicios Web - Proyecto SENA GA7-EV03');
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor de API corriendo en http://localhost:${PORT}`);
});