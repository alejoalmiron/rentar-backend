import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { PrismaClient } from '@prisma/client';
import { swaggerSpec } from './config/swagger.js';
import vehiculoRoutes from './routes/vehiculo.routes.js';
import clienteRoutes from './routes/cliente.routes.js';

import reservaRoutes from './routes/reserva.routes.js';


// GraphQL
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();


app.use(cors({ origin: '*' }));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Rentar funcionando correctamente' });
});

async function startServer() {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    introspection: true
  });
  
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📄 Documentación Swagger lista en http://localhost:${PORT}/api-docs`);
    console.log(`🎯 GraphQL Sandbox listo en http://localhost:${PORT}/graphql`);
  });
}

startServer();
