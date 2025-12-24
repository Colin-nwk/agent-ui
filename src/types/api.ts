// Shared API types

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
