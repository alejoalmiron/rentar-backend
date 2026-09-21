import { prisma } from '../index.js';

export const resolvers = {
  Query: {
    vehiculosDisponibles: async (_, { tipo, marca, modelo, precioMin, precioMax, fechaInicio, fechaFin }) => {
      try {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        const vehiculos = await prisma.vehiculo.findMany({
          where: {
            activo: true,
            estado: 'DISPONIBLE',
            ...(tipo && { tipo }),
            ...(marca && { marca: { contains: marca } }),
            ...(modelo && { modelo: { contains: modelo } }),
            ...(precioMin !== undefined && { precioDiario: { gte: precioMin } }),
            ...(precioMax !== undefined && { precioDiario: { lte: precioMax } }),
          },
        });

        const vehiculosDisponibles = [];

        for (const vehiculo of vehiculos) {
          const reservasSolapadas = await prisma.reserva.findFirst({
            where: {
              vehiculoId: vehiculo.id,
              estado: { not: 'CANCELADA' },
              AND: [
                { fechaInicio: { lt: fin } },
                { fechaFin: { gt: inicio } }
              ]
            },
          });

          if (!reservasSolapadas) {
            vehiculosDisponibles.push(vehiculo);
          }
        }

        return vehiculosDisponibles;
      } catch (error) {
        throw new Error('Error al consultar disponibilidad: ' + error.message);
      }
    },
    reservasPorCliente: (_, { dni }) => prisma.reserva.findMany({
      where: { cliente: { documento: dni } },
      include: { cliente: true, vehiculo: true },
      orderBy: { fechaInicio: 'desc' },
    }),
    historialReservas: (_, { estado, patente }) => prisma.reserva.findMany({
      where: {
        ...(estado && { estado }),
        ...(patente && { vehiculo: { patente } }),
      },
      include: { cliente: true, vehiculo: true },
      orderBy: { fechaInicio: 'desc' },
    }),
  },
  Mutation: {
    cancelarReserva: async (_, { id }) => {
      const reserva = await prisma.reserva.findUnique({ where: { id: Number(id) } });
      if (!reserva) throw new Error('Reserva no encontrada');
      if (reserva.estado === 'CANCELADA') throw new Error('La reserva ya está cancelada');
      if (new Date() >= new Date(reserva.fechaInicio)) {
        throw new Error('No se puede cancelar una reserva que ya comenzó');
      }

      return prisma.reserva.update({
        where: { id: Number(id) },
        data: { estado: 'CANCELADA' },
        include: { cliente: true, vehiculo: true },
      });
    },
  },
  Cliente: {
    dni: (cliente) => cliente.documento,
  },
  Reserva: {
    montoTotal: (reserva) => reserva.importeTotal,
  },
};