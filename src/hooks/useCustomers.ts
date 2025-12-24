import { useQuery } from '@tanstack/react-query';
import { createCrudHooks } from '../lib/hooks-factory';
import { customerService } from '../services/customer';
import type { 
  Customer, 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  ListCustomersQuery,
  CustomerStats 
} from '../types/customer';

// Generate all standard CRUD hooks from factory
const customerHooks = createCrudHooks<Customer, CreateCustomerDto, UpdateCustomerDto, ListCustomersQuery>(
  'customers',
  customerService
);

// Export standard CRUD hooks with clearer names
export const customerKeys = customerHooks.queryKeys;
export const useCustomers = customerHooks.useList;
export const useCustomer = customerHooks.useDetail;
export const useCreateCustomer = customerHooks.useCreate;
export const useUpdateCustomer = customerHooks.useUpdate;
export const useDeleteCustomer = customerHooks.useDelete;

// Custom hook for stats (not part of standard CRUD)
export function useCustomerStats() {
  return useQuery({
    queryKey: [...customerKeys.all, 'stats'] as const,
    queryFn: () => customerService.getStats(),
  });
}
