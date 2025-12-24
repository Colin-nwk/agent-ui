import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CrudService, PaginatedResponse } from './api-factory';

interface QueryKeysConfig {
  all: readonly string[];
  lists: () => readonly string[];
  list: (query?: any) => readonly (string | any)[];
  details: () => readonly string[];
  detail: (id: string) => readonly string[];
}

function createQueryKeys(resourceName: string): QueryKeysConfig {
  return {
    all: [resourceName] as const,
    lists: () => [resourceName, 'list'] as const,
    list: (query?: any) => [resourceName, 'list', query] as const,
    details: () => [resourceName, 'detail'] as const,
    detail: (id: string) => [resourceName, 'detail', id] as const,
  };
}

export interface CrudHooks<T, CreateDto, UpdateDto, QueryParams> {
  queryKeys: QueryKeysConfig;
  useList: (query?: QueryParams) => ReturnType<typeof useQuery<PaginatedResponse<T>>>;
  useDetail: (id: string) => ReturnType<typeof useQuery<T>>;
  useCreate: () => ReturnType<typeof useMutation<T, Error, { dto: CreateDto; file?: File }>>;
  useUpdate: () => ReturnType<typeof useMutation<T, Error, { id: string; dto: UpdateDto; file?: File }>>;
  useDelete: () => ReturnType<typeof useMutation<void, Error, string>>;
}

export function createCrudHooks<T, CreateDto, UpdateDto, QueryParams = Record<string, any>>(
  resourceName: string,
  service: CrudService<T, CreateDto, UpdateDto, QueryParams>
): CrudHooks<T, CreateDto, UpdateDto, QueryParams> {
  const queryKeys = createQueryKeys(resourceName);

  return {
    queryKeys,

    useList: (query?: QueryParams) => {
      return useQuery({
        queryKey: queryKeys.list(query),
        queryFn: () => service.list(query),
      });
    },

    useDetail: (id: string) => {
      return useQuery({
        queryKey: queryKeys.detail(id),
        queryFn: () => service.getById(id),
        enabled: !!id,
      });
    },

    useCreate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ dto, file }: { dto: CreateDto; file?: File }) => service.create(dto, file),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        },
      });
    },

    useUpdate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ id, dto, file }: { id: string; dto: UpdateDto; file?: File }) => 
          service.update(id, dto, file),
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        },
      });
    },

    useDelete: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (id: string) => service.delete(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        },
      });
    },
  };
}
