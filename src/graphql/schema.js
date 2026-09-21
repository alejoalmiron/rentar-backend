export const typeDefs = `
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

  type Cliente {
    id: ID!
    dni: String!
    nombre: String!
    apellido: String!
    email: String!
    telefono: String
  }

  type Reserva {
    id: ID!
    fechaInicio: String!
    fechaFin: String!
    estado: EstadoReserva!
    montoTotal: Float!
    cliente: Cliente!
    vehiculo: Vehiculo!
  }

  enum EstadoReserva {
    CONFIRMADA
    CANCELADA
    FINALIZADA
  }

  type Query {
    vehiculosDisponibles(
      tipo: String
      marca: String
      modelo: String
      precioMin: Float
      precioMax: Float
      fechaInicio: String!
      fechaFin: String!
    ): [Vehiculo!]!
    reservasPorCliente(dni: String!): [Reserva!]!
    historialReservas(estado: String, patente: String): [Reserva!]!
  }

  type Mutation {
    cancelarReserva(id: ID!): Reserva!
  }
`;