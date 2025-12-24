import { extendService } from '../lib/api-factory';
import { api } from '../lib/axios';
import type { 
  Customer, 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  ListCustomersQuery, 
  CustomerStats 
} from '../types/customer';

// Using the factory with 'customers' as the list key
export const customerService = extendService<
  Customer, 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  ListCustomersQuery, 
  { getStats(): Promise<CustomerStats> },
  'customers'  // <-- List key matching API response
>(
  { baseUrl: '/agent-portal/customers', fileFieldName: 'customerImage', listKey: 'customers' },
  () => ({
    async getStats(): Promise<CustomerStats> {
      const { data } = await api.get<CustomerStats>('/agent-portal/customers/stats');
      return data;
    },
  })
);
