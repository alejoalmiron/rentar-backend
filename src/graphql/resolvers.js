import { prisma } from '../index.js';

export const resolvers = {
  Query: {
    consultarDisponibilidad: async (_, { tipo, marca, modelo, precioMin, precioMax, fechaInicio, fechaFin }) => {
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
  },
};