import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { PrismaClient } from '@prisma/client';
import { swaggerSpec } from './config/swagger.js';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Rentar funcionando correctamente' });
});

app.get('/api/vehiculos', async (req, res) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });
    res.json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los vehículos.' });
  }
});

app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      where: { activo: true },
      orderBy: { id: 'asc' },
    });
    res.json(clientes.map((cliente) => ({ ...cliente, dni: cliente.documento })));
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'No se pudieron obtener los clientes.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📄 Documentación Swagger lista en http://localhost:${PORT}/api-docs`);
});