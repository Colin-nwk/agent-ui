import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customer';
import type { 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  ListCustomersQuery 
} from '../types/customer';

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (query?: ListCustomersQuery) => [...customerKeys.lists(), query] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, 'stats'] as const,
};

export function useCustomers(query?: ListCustomersQuery) {
  return useQuery({
    queryKey: customerKeys.list(query),
    queryFn: () => customerService.list(query),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
}

export function useCustomerStats() {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => customerService.getStats(),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto, image }: { dto: CreateCustomerDto; image?: File }) => 
      customerService.create(dto, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto, image }: { id: string; dto: UpdateCustomerDto; image?: File }) =>
      customerService.update(id, dto, image),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
}
