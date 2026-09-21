import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  enum TipoVehiculo {
    SEDAN
    SUV
    PICKUP
    COUPE
    HATCHBACK
  }

  enum EstadoVehiculo {
    DISPONIBLE
    RESERVADO
    EN_ALQUILER
  }

  type Vehiculo {
    id: ID!
    patente: String!
    marca: String!
    modelo: String!
    anio: Int!
    color: String
    tipo: TipoVehiculo!
    precioDiario: Float!
    estado: EstadoVehiculo!
    activo: Boolean!
  }

  type Query {
    consultarDisponibilidad(
      tipo: TipoVehiculo
      marca: String
      modelo: String
      precioMin: Float
      precioMax: Float
      fechaInicio: String!
      fechaFin: String!
    ): [Vehiculo]
  }
`;