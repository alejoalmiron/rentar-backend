import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      where: { activo: true }
    });
    res.json(clientes.map((cliente) => ({ ...cliente, dni: cliente.documento })));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes', detalle: error.message });
  }
};

export const getClienteById = async (req, res) => {
  try {
    const cliente = await prisma.cliente.findFirst({
      where: { id: Number(req.params.id), activo: true }
    });
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ ...cliente, dni: cliente.documento });
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el cliente', detalle: error.message });
  }
};

export const createCliente = async (req, res) => {
  try {
    const { documento, dni, nombre, apellido, email, telefono, fechaNacimiento } = req.body || {};
    const documentoCliente = documento || dni;

    if (!documentoCliente || !nombre || !apellido || !email) {
      return res.status(400).json({
        error: 'Faltan datos obligatorios',
        campos: ['dni', 'nombre', 'apellido', 'email'],
      });
    }

    const nuevoCliente = await prisma.cliente.create({
      data: {
        documento: documentoCliente,
        nombre,
        apellido,
        email,
        telefono,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null
      }
    });
    res.status(201).json({ ...nuevoCliente, dni: nuevoCliente.documento });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el cliente', detalle: error.message });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const { documento, nombre, apellido, email, telefono, fechaNacimiento } = req.body;

    const dataUpdate = {};
    if (documento) dataUpdate.documento = documento;
    if (nombre) dataUpdate.nombre = nombre;
    if (apellido) dataUpdate.apellido = apellido;
    if (email) dataUpdate.email = email;
    if (telefono) dataUpdate.telefono = telefono;
    if (fechaNacimiento) dataUpdate.fechaNacimiento = new Date(fechaNacimiento);

    const clienteActualizado = await prisma.cliente.update({
      where: { id: Number(req.params.id) },
      data: dataUpdate
    });
    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el cliente', detalle: error.message });
  }
};

export const deleteCliente = async (req, res) => {
  try {
    const clienteEliminado = await prisma.cliente.update({
      where: { id: Number(req.params.id) },
      data: { activo: false }
    });
    res.json({ mensaje: 'Cliente dado de baja correctamente', cliente: clienteEliminado });
  } catch (error) {
    res.status(500).json({ error: 'Error al dar de baja el cliente', detalle: error.message });
  }
};