const URL_BASE_REST = 'http://localhost:5000/api';
const URL_BASE_GRAPHQL = 'http://localhost:5000/graphql';

export async function consumirEndpoint(url, opciones = {}) {
  try {
    const respuesta = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...opciones.headers,
      },
      ...opciones,
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
    }

    return await respuesta.json();
  } catch (error) {
    console.error(`Error en petición a ${url}:`, error.message);
    throw error;
  }
}

// --- SERVICIOS REST ---
export const getVehiculos = () => consumirEndpoint(`${URL_BASE_REST}/vehiculos`);
export const crearVehiculo = (data) => consumirEndpoint(`${URL_BASE_REST}/vehiculos`, { method: 'POST', body: JSON.stringify(data) });

export const getClientes = () => consumirEndpoint(`${URL_BASE_REST}/clientes`);
export const crearCliente = (data) => consumirEndpoint(`${URL_BASE_REST}/clientes`, { method: 'POST', body: JSON.stringify(data) });

export const crearReserva = (data) => consumirEndpoint(`${URL_BASE_REST}/reservas`, { method: 'POST', body: JSON.stringify(data) });

// --- SERVICIO GRAPHQL ---
export const consultarGraphQL = (query, variables = {}) => {
  return consumirEndpoint(URL_BASE_GRAPHQL, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  });
};