import { callGrpc } from './clientFactory.js';
import { normalizeDates, toTimestamp } from './timestamps.js';

const unwrap = (response, key) => normalizeDates(response?.[key] ?? response);

export const vehicleClient = {
  async list(filters = {}) {
    const response = await callGrpc('vehicle', 'ListVehicles', filters);
    return normalizeDates(response.vehicles || []);
  },
  async getById(id) {
    return unwrap(await callGrpc('vehicle', 'GetVehicle', { id: String(id) }), 'vehicle');
  },
  async getByPlate(patente) {
    return unwrap(await callGrpc('vehicle', 'GetVehicleByPlate', { patente }), 'vehicle');
  },
  async create(vehiculo) {
    return unwrap(await callGrpc('vehicle', 'CreateVehicle', { vehiculo }), 'vehicle');
  },
  async update(id, vehiculo) {
    return unwrap(await callGrpc('vehicle', 'UpdateVehicle', { id: String(id), vehiculo }), 'vehicle');
  },
  async deactivate(id) {
    return unwrap(await callGrpc('vehicle', 'DeactivateVehicle', { id: String(id) }), 'vehicle');
  },
  checkOperational({ id, patente }) {
    return callGrpc('vehicle', 'CheckVehicleOperational', {
      ...(id !== undefined && { vehicleId: String(id) }),
      ...(patente && { patente }),
    });
  },
  checkAvailability({ id, patente, fechaInicio, fechaFin }) {
    return callGrpc('vehicle', 'CheckVehicleAvailability', {
      ...(id !== undefined && { vehicleId: String(id) }),
      ...(patente && { patente }),
      fechaInicio: toTimestamp(fechaInicio),
      fechaFin: toTimestamp(fechaFin),
    });
  },
};