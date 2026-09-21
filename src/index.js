import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { PrismaClient } from '@prisma/client';
import { swaggerSpec } from './config/swagger.js';
import vehiculoRoutes from './routes/vehiculo.routes.js';
import clienteRoutes from './routes/cliente.routes.js';

import reservaRoutes from './routes/reserva.routes.js';


dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/reservas", reservaRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Rentar funcionando correctamente' });
});

// Endpoints REST de Integrante 2
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/clientes', clienteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📄 Documentación Swagger lista en http://localhost:${PORT}/api-docs`);
});
