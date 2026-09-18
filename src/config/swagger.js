import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Rentar - Sistema de Alquiler de Vehículos',
      version: '1.0.0',
      description: 'Documentación de los endpoints REST para el Hito 1 (UNLa)',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);