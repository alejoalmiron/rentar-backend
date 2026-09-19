import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const crearReserva = async (req, res) => {

    let respuestaReserva;
    let statusCodigo = 200;
    let continuar = true;

    try{
        const{ clienteId, vehiculoId, fechaInicio, fechaFin } = req.body;

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const ahora = new Date();

        if(inicio<=ahora){
            statusCodigo = 400;
            respuestaReserva = { error: "La fecha de inicio no puede ser anterior o igual a la fecha actual" };
            continuar = false;
        }

        if(continuar && fin<=inicio){
            statusCodigo = 400;
            respuestaReserva = { error: "La fecha de fin no puede ser anterior o igual a la fecha de inicio" };
            continuar = false;
        }

        let cliente;

        if(continuar){
            cliente = await prisma.cliente.findUnique({where: { id: Number(clienteId) }});
            
            if(!cliente || !cliente.activo){
                statusCodigo = 400;
                respuestaReserva = { error: "El cliente no existe o no se encuentra activo" };
                continuar = false;
            }
        }


        let vehiculo;
        
        if(continuar){
                vehiculo = await prisma.vehiculo.findUnique({where: { id: Number(vehiculoId) }});
                
                if(!vehiculo || !vehiculo.activo){
                    statusCodigo = 400;
                    respuestaReserva = { error: "El vehiculo no existe o no se encuentra activo" };
                    continuar = false;
                }
        }


        if(continuar){
            const conflicto = await prisma.reserva.findFirst({
                where: {
                    vehiculoId: Number(vehiculoId),
                    estado: "CONFIRMADA",
                    OR: [{ fechaInicio: { lte: fin }, fechaFin: { gte: inicio } }]
                }
            });

            if (conflicto) {
                statusCodigo = 400;
                respuestaReserva = { error: "El vehiculo no esta disponible en las fechas solicitadas" };
                continuar = false;
            }
        }

        if(continuar){
            const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
            const importeTotal = dias * vehiculo.precioDiario;

            statusCodigo = 201;
            respuestaReserva = await prisma.reserva.create({
                data: {
                    clienteId: Number(clienteId),
                    vehiculoId: Number(vehiculoId),
                    fechaInicio: inicio,
                    fechaFin: fin,
                    importeTotal,
                    estado: "CONFIRMADA"
                }
            });
        }

    } catch (error) {
        statusCodigo = 500;
        respuestaReserva = { error: "Error al crear la reserva", detalle: error.message };
    }

    return res.status(statusCodigo).json(respuestaReserva);

};

export const cancelarReserva = async (req, res) => {

    let respuestaReserva;
    let statusCodigo = 200;
    let continuar = true;

  try {
        const { id } = req.params;

        let reserva;

        if(continuar){
            reserva = await prisma.reserva.findUnique({ where: { id: Number(id) } });

            if (!reserva) {
                statusCodigo = 404;
                respuestaReserva = { error: "Reserva no encontrada" };
                continuar = false;
            }
        }

        if(continuar && reserva.estado === "CANCELADA"){
            statusCodigo = 400;
            respuestaReserva = { error: "La reserva ya se encuentra cancelada" };
            continuar = false;
        }

        if (continuar && new Date() >= new Date(reserva.fechaInicio)) {
            statusCodigo = 400;
            respuestaReserva = { error: "No se puede cancelar una reserva que ya comenzo o finalizo" };
            continuar = false;
        }

        if(continuar){
            const reservaCancelada = await prisma.reserva.update({where: { id: Number(id) }, data: { estado: "CANCELADA" }});

            respuestaReserva = { mensaje: "Reserva cancelada correctamente", reserva: reservaCancelada };
        }

    } catch (error) {
        statusCodigo = 500;
        respuestaReserva = { error: "Error al cancelar la reserva", detalle: error.message };
    }

    return res.status(statusCodigo).json(respuestaReserva);
       
};