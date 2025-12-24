import { createCrudService, extendService } from '../lib/api-factory';
import { api } from '../lib/axios';
import type { 
  Customer, 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  ListCustomersQuery, 
  CustomerStats 
} from '../types/customer';

// Using the factory for standard CRUD + extending with custom methods
export const customerService = extendService<Customer, CreateCustomerDto, UpdateCustomerDto, ListCustomersQuery, {
  getStats(): Promise<CustomerStats>;
}>(
  { baseUrl: '/agent-portal/customers', fileFieldName: 'customerImage' },
  () => ({
    async getStats(): Promise<CustomerStats> {
      const { data } = await api.get<CustomerStats>('/agent-portal/customers/stats');
      return data;
    },
  })
);
