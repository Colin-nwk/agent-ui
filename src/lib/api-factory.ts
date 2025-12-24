import { api } from './axios';

// Generic paginated response with customizable data key
// Usage: PaginatedResponse<Customer, 'customers'> => { customers: Customer[], total, ... }
export type PaginatedResponse<T, K extends string = 'data'> = {
  [key in K]: T[];
} & {
  total: number;
  pageNumber: number;
  limitNumber: number;
  totalPages: number;
};

export interface CrudService<T, CreateDto, UpdateDto, QueryParams = Record<string, any>, ListKey extends string = 'data'> {
  create(dto: CreateDto, file?: File): Promise<T>;
  list(query?: QueryParams): Promise<PaginatedResponse<T, ListKey>>;
  getById(id: string): Promise<T>;
  update(id: string, dto: UpdateDto, file?: File): Promise<T>;
  delete(id: string): Promise<void>;
}

interface ServiceConfig {
  baseUrl: string;
  fileFieldName?: string;
  listKey?: string; // The key name for the array in list response (e.g., 'customers', 'inventory')
}

export function createCrudService<
  T, 
  CreateDto, 
  UpdateDto, 
  QueryParams = Record<string, any>,
  ListKey extends string = 'data'
>(
  config: ServiceConfig & { listKey?: ListKey }
): CrudService<T, CreateDto, UpdateDto, QueryParams, ListKey> {
  const { baseUrl, fileFieldName = 'image' } = config;

  return {
    async create(dto: CreateDto, file?: File): Promise<T> {
      const formData = new FormData();
      Object.entries(dto as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (file) formData.append(fileFieldName, file);

      const { data } = await api.post<T>(baseUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },

    async list(query?: QueryParams): Promise<PaginatedResponse<T, ListKey>> {
      const { data } = await api.get<PaginatedResponse<T, ListKey>>(baseUrl, { params: query });
      return data;
    },

    async getById(id: string): Promise<T> {
      const { data } = await api.get<T>(`${baseUrl}/${id}`);
      return data;
    },

    async update(id: string, dto: UpdateDto, file?: File): Promise<T> {
      const formData = new FormData();
      Object.entries(dto as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (file) formData.append(fileFieldName, file);

      const { data } = await api.put<T>(`${baseUrl}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },

    async delete(id: string): Promise<void> {
      await api.delete(`${baseUrl}/${id}`);
    },
  };
}

// Helper for services that need custom methods beyond CRUD
export function extendService<
  T, 
  CreateDto, 
  UpdateDto, 
  QueryParams, 
  Extensions,
  ListKey extends string = 'data'
>(
  config: ServiceConfig & { listKey?: ListKey },
  extensions: (baseService: CrudService<T, CreateDto, UpdateDto, QueryParams, ListKey>) => Extensions
): CrudService<T, CreateDto, UpdateDto, QueryParams, ListKey> & Extensions {
  const baseService = createCrudService<T, CreateDto, UpdateDto, QueryParams, ListKey>(config);
  return { ...baseService, ...extensions(baseService) };
}
