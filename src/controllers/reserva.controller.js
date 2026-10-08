import { rentalClient } from '../grpc/rental.client.js';
import { createReservation } from '../orchestrators/reserva.orchestrator.js';
import { respondWithRpc } from './rpcResponse.js';

export const crearReserva = async (req, res) => {
  return respondWithRpc(res, () => createReservation(req.body || {}), undefined, 201);
};

export const cancelarReserva = async (req, res) => {
  return respondWithRpc(
    res,
    () => rentalClient.cancel(req.params.id),
    (reserva) => ({ mensaje: 'Reserva cancelada correctamente', reserva }),
  );
};