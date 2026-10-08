import { vehicleClient } from '../grpc/vehicle.client.js';
import { respondWithRpc } from './rpcResponse.js';

export const getVehiculos = async (req, res) => {
  return respondWithRpc(res, () => vehicleClient.list(req.query));
};

export const getVehiculoById = async (req, res) => {
  return respondWithRpc(res, () => vehicleClient.getById(req.params.id));
};

export const createVehiculo = async (req, res) => {
  return respondWithRpc(res, () => vehicleClient.create(req.body || {}), undefined, 201);
};

export const updateVehiculo = async (req, res) => {
  return respondWithRpc(res, () => vehicleClient.update(req.params.id, req.body || {}));
};

export const deleteVehiculo = async (req, res) => {
  return respondWithRpc(
    res,
    () => vehicleClient.deactivate(req.params.id),
    (vehiculo) => ({ mensaje: 'Vehículo dado de baja correctamente', vehiculo }),
  );
};