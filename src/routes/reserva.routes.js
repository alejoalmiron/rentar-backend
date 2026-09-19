import { Router } from "express";
import { crearReserva, cancelarReserva } from "../controllers/reserva.controller.js";

const router = Router();

router.post("/", crearReserva);
router.patch("/:id/cancelar", cancelarReserva);
export default router;