import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVehiculos = async (req, res) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      where: { activo: true }
    });
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los vehículos', detalle: error.message });
  }
};

export const getVehiculoById = async (req, res) => {
  try {
    const vehiculo = await prisma.vehiculo.findFirst({
      where: { id: Number(req.params.id), activo: true }
    });
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el vehículo', detalle: error.message });
  }
};

export const createVehiculo = async (req, res) => {
  try {
    const { patente, marca, modelo, anio, color, tipo, precioDiario, estado } = req.body;
    
    const nuevoVehiculo = await prisma.vehiculo.create({
      data: {
        patente,
        marca,
        modelo,
        anio: Number(anio),
        color,
        tipo,
        precioDiario: parseFloat(precioDiario),
        estado: estado || 'DISPONIBLE'
      }
    });
    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el vehículo', detalle: error.message });
  }
};

export const updateVehiculo = async (req, res) => {
  try {
    const { patente, marca, modelo, anio, color, tipo, precioDiario, estado } = req.body;

    // REGLA DE NEGOCIO: Bloquear modificación de la patente
    if (patente) {
      return res.status(400).json({ 
        error: 'Operación denegada: La patente no puede modificarse una vez registrado el vehículo.' 
      });
    }

    const dataUpdate = {};
    if (marca) dataUpdate.marca = marca;
    if (modelo) dataUpdate.modelo = modelo;
    if (anio) dataUpdate.anio = Number(anio);
    if (color) dataUpdate.color = color;
    if (tipo) dataUpdate.tipo = tipo;
    if (precioDiario) dataUpdate.precioDiario = parseFloat(precioDiario);
    if (estado) dataUpdate.estado = estado;

    const vehiculoActualizado = await prisma.vehiculo.update({
      where: { id: Number(req.params.id) },
      data: dataUpdate
    });
    res.json(vehiculoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el vehículo', detalle: error.message });
  }
};

export const deleteVehiculo = async (req, res) => {
  try {
    const vehiculoEliminado = await prisma.vehiculo.update({
      where: { id: Number(req.params.id) },
      data: { activo: false } 
    });
    res.json({ mensaje: 'Vehículo dado de baja correctamente', vehiculo: vehiculoEliminado });
  } catch (error) {
    res.status(500).json({ error: 'Error al dar de baja el vehículo', detalle: error.message });
  }
};