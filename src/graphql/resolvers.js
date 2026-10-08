import { customerClient } from '../grpc/customer.client.js';
import { rentalClient } from '../grpc/rental.client.js';
import { toGraphqlError } from '../grpc/httpErrors.js';
import { vehicleClient } from '../grpc/vehicle.client.js';

async function hydrateReservation(reservation) {
  const customerId = reservation.customerId ?? reservation.clienteId;
  const vehicleId = reservation.vehicleId ?? reservation.vehiculoId;
  const [cliente, vehiculo] = await Promise.all([
    reservation.cliente || customerId === undefined
      ? reservation.cliente
      : customerClient.getById(customerId),
    reservation.vehiculo || vehicleId === undefined
      ? reservation.vehiculo
      : vehicleClient.getById(vehicleId),
  ]);

  return { ...reservation, cliente, vehiculo };
}

async function resolverGraphql(operation) {
  try {
    return await operation();
  } catch (error) {
    throw toGraphqlError(error);
  }
}

export const resolvers = {
  Query: {
    vehiculosDisponibles: (_, filters) => resolverGraphql(async () => {
      const { fechaInicio, fechaFin, ...vehicleFilters } = filters;
      const vehicles = await vehicleClient.list(vehicleFilters);
      const checks = await Promise.all(vehicles.map(async (vehicle) => {
        const [operational, reservationAvailability] = await Promise.all([
          vehicleClient.checkOperational({ id: vehicle.id, patente: vehicle.patente }),
          rentalClient.checkAvailability({ vehiculoId: vehicle.id, fechaInicio, fechaFin }),
        ]);

        const isOperational = operational.operational !== false
          && operational.active !== false
          && vehicle.activo !== false;
        return isOperational && reservationAvailability.available !== false ? vehicle : null;
      }));

      return checks.filter(Boolean);
    }),
    reservasPorCliente: (_, { dni }) => resolverGraphql(async () => {
      const customer = await customerClient.getByDocument(dni);
      const reservations = await rentalClient.list({ clienteId: customer.id });
      return Promise.all(reservations.map(hydrateReservation));
    }),
    historialReservas: (_, { estado, patente }) => resolverGraphql(async () => {
      const reservations = await rentalClient.history({ estado });
      const hydrated = await Promise.all(reservations.map(hydrateReservation));
      return patente
        ? hydrated.filter((reservation) => reservation.vehiculo?.patente === patente)
        : hydrated;
    }),
  },
  Mutation: {
    cancelarReserva: (_, { id }) => resolverGraphql(async () => {
      const reservation = await rentalClient.cancel(id);
      return hydrateReservation(reservation);
    }),
  },
  Cliente: {
    dni: (cliente) => cliente.dni || cliente.documento,
  },
  Reserva: {
    montoTotal: (reserva) => reserva.montoTotal ?? reserva.importeTotal,
  },
};