import { callGrpc } from './clientFactory.js';
import { normalizeDates, toTimestamp } from './timestamps.js';

const unwrap = (response, key) => normalizeDates(response?.[key] ?? response);

export const customerClient = {
  async list() {
    const response = await callGrpc('customer', 'ListCustomers', {});
    return normalizeDates(response.customers || []);
  },
  async getById(id) {
    return unwrap(await callGrpc('customer', 'GetCustomer', { id: String(id) }), 'customer');
  },
  async getByDocument(documento) {
    return unwrap(await callGrpc('customer', 'GetCustomerByDocument', { documento }), 'customer');
  },
  async create(cliente) {
    const customer = {
      ...cliente,
      documento: cliente.documento || cliente.dni,
      ...(cliente.fechaNacimiento && { fechaNacimiento: toTimestamp(cliente.fechaNacimiento) }),
    };
    delete customer.dni;
    return unwrap(await callGrpc('customer', 'CreateCustomer', { customer }), 'customer');
  },
  async update(id, cliente) {
    const customer = { ...cliente };
    if (customer.fechaNacimiento) customer.fechaNacimiento = toTimestamp(customer.fechaNacimiento);
    if (customer.dni) {
      customer.documento = customer.dni;
      delete customer.dni;
    }
    return unwrap(await callGrpc('customer', 'UpdateCustomer', { id: String(id), customer }), 'customer');
  },
  async deactivate(id) {
    return unwrap(await callGrpc('customer', 'DeactivateCustomer', { id: String(id) }), 'customer');
  },
  validate({ id, documento }) {
    return callGrpc('customer', 'ValidateCustomer', {
      ...(id !== undefined && { customerId: String(id) }),
      ...(documento && { documento }),
    });
  },
};