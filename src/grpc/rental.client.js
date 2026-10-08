import { callGrpc } from './clientFactory.js';
import { normalizeDates, toTimestamp } from './timestamps.js';

const unwrap = (response, key) => normalizeDates(response?.[key] ?? response);

export const rentalClient = {
  checkAvailability({ vehiculoId, fechaInicio, fechaFin }) {
    return callGrpc('rental', 'CheckReservationAvailability', {
      vehicleId: String(vehiculoId),
      fechaInicio: toTimestamp(fechaInicio),
      fechaFin: toTimestamp(fechaFin),
    });
  },
  async create({ clienteId, vehiculoId, fechaInicio, fechaFin }) {
    const response = await callGrpc('rental', 'CreateReservation', {
      customerId: String(clienteId),
      vehicleId: String(vehiculoId),
      fechaInicio: toTimestamp(fechaInicio),
      fechaFin: toTimestamp(fechaFin),
    });
    return unwrap(response, 'reservation');
  },
  async getById(id) {
    return unwrap(await callGrpc('rental', 'GetReservation', { id: String(id) }), 'reservation');
  },
  async list(filters = {}) {
    const response = await callGrpc('rental', 'ListReservations', {
      ...(filters.clienteId !== undefined && { customerId: String(filters.clienteId) }),
      ...(filters.estado && { estado: filters.estado }),
    });
    return normalizeDates(response.reservations || []);
  },
  async cancel(id) {
    return unwrap(await callGrpc('rental', 'CancelReservation', { id: String(id) }), 'reservation');
  },
  async history(filters = {}) {
    const response = await callGrpc('rental', 'GetRentalHistory', {
      ...(filters.estado && { estado: filters.estado }),
    });
    return normalizeDates(response.reservations || []);
  },
};