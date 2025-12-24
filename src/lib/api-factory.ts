import { api } from './axios';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CrudService<T, CreateDto, UpdateDto, QueryParams = Record<string, any>> {
  create(dto: CreateDto, file?: File): Promise<T>;
  list(query?: QueryParams): Promise<PaginatedResponse<T>>;
  getById(id: string): Promise<T>;
  update(id: string, dto: UpdateDto, file?: File): Promise<T>;
  delete(id: string): Promise<void>;
}

interface ServiceConfig {
  baseUrl: string;
  fileFieldName?: string; // e.g., 'customerImage', 'image', etc.
}

export function createCrudService<T, CreateDto, UpdateDto, QueryParams = Record<string, any>>(
  config: ServiceConfig
): CrudService<T, CreateDto, UpdateDto, QueryParams> {
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

    async list(query?: QueryParams): Promise<PaginatedResponse<T>> {
      const { data } = await api.get<PaginatedResponse<T>>(baseUrl, { params: query });
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
export function extendService<T, CreateDto, UpdateDto, QueryParams, Extensions>(
  config: ServiceConfig,
  extensions: (baseService: CrudService<T, CreateDto, UpdateDto, QueryParams>) => Extensions
): CrudService<T, CreateDto, UpdateDto, QueryParams> & Extensions {
  const baseService = createCrudService<T, CreateDto, UpdateDto, QueryParams>(config);
  return { ...baseService, ...extensions(baseService) };
}
