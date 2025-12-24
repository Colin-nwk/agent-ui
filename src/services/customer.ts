import { api } from '../lib/axios';
import type { 
  Customer, 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  ListCustomersQuery, 
  PaginatedResponse,
  CustomerStats 
} from '../types/customer';

const BASE_URL = '/agent-portal/customers';

export const customerService = {
  async create(dto: CreateCustomerDto, image?: File): Promise<Customer> {
    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });
    if (image) formData.append('customerImage', image);

    const { data } = await api.post<Customer>(BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async list(query?: ListCustomersQuery): Promise<PaginatedResponse<Customer>> {
    const { data } = await api.get<PaginatedResponse<Customer>>(BASE_URL, { params: query });
    return data;
  },

  async getById(id: string): Promise<Customer> {
    const { data } = await api.get<Customer>(`${BASE_URL}/${id}`);
    return data;
  },

  async update(id: string, dto: UpdateCustomerDto, image?: File): Promise<Customer> {
    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    if (image) formData.append('image', image);

    const { data } = await api.put<Customer>(`${BASE_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  async getStats(): Promise<CustomerStats> {
    const { data } = await api.get<CustomerStats>(`${BASE_URL}/stats`);
    return data;
  },
};
