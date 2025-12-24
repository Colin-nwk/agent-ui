# API Service & Hooks Factory Pattern

A comprehensive guide to the generic CRUD factory pattern used in this project for creating reusable API services and React Query hooks.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Factory](#api-factory)
4. [Hooks Factory](#hooks-factory)
5. [Step-by-Step: Adding a New Resource](#step-by-step-adding-a-new-resource)
6. [Handling Custom Endpoints](#handling-custom-endpoints)
7. [Best Practices](#best-practices)
8. [Quick Reference](#quick-reference)

---

## Overview

This pattern eliminates boilerplate code when integrating with REST APIs. Instead of writing 50+ lines of repetitive code for each resource, you can create a fully-featured service + hooks in just 15-20 lines.

### Benefits

- **DRY Code**: Write CRUD logic once, reuse everywhere
- **Type Safety**: Full TypeScript support with generics
- **Consistency**: All services follow the same patterns
- **Extensibility**: Easy to add custom endpoints
- **Maintainability**: Fix bugs or add features in one place

### Files

| File                       | Purpose                                    |
| -------------------------- | ------------------------------------------ |
| `src/lib/api-factory.ts`   | Generic CRUD service factory               |
| `src/lib/hooks-factory.ts` | Generic React Query hooks factory          |
| `src/types/api.ts`         | Shared API types (PaginatedResponse, etc.) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Components                          │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Custom Hooks (useCustomers.ts)              │    │
│  │    - Uses hooks-factory for CRUD                         │    │
│  │    - Adds custom hooks for special endpoints             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              API Services (customer.ts)                  │    │
│  │    - Uses api-factory for CRUD                           │    │
│  │    - Extends with custom methods                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Axios Client (lib/axios.ts)                 │    │
│  │    - Base URL, interceptors, auth headers                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│                         Backend API                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Factory

### Location: `src/lib/api-factory.ts`

### Core Function: `createCrudService`

Creates a service with standard CRUD operations.

```typescript
import { createCrudService } from "../lib/api-factory";

const service = createCrudService<Entity, CreateDto, UpdateDto, QueryParams>({
  baseUrl: "/api/resource",
  fileFieldName: "image", // Optional: field name for file uploads
});
```

### Generated Methods

| Method                           | HTTP   | Description          |
| -------------------------------- | ------ | -------------------- |
| `service.create(dto, file?)`     | POST   | Create new record    |
| `service.list(query?)`           | GET    | List with pagination |
| `service.getById(id)`            | GET    | Get single record    |
| `service.update(id, dto, file?)` | PUT    | Update record        |
| `service.delete(id)`             | DELETE | Delete record        |

### Extension Function: `extendService`

For adding custom methods beyond CRUD.

```typescript
import { extendService } from "../lib/api-factory";
import { api } from "../lib/axios";

export const customerService = extendService<
  Customer, // Entity type
  CreateCustomerDto, // Create DTO
  UpdateCustomerDto, // Update DTO
  ListCustomersQuery, // Query params
  {
    // Custom methods signature
    getStats(): Promise<CustomerStats>;
    enable(id: string): Promise<Customer>;
    disable(id: string): Promise<Customer>;
  }
>(
  { baseUrl: "/agent-portal/customers", fileFieldName: "customerImage" },
  () => ({
    // Implement custom methods
    async getStats() {
      const { data } = await api.get("/agent-portal/customers/stats");
      return data;
    },
    async enable(id: string) {
      const { data } = await api.patch(`/agent-portal/customers/${id}/enable`);
      return data;
    },
    async disable(id: string) {
      const { data } = await api.patch(`/agent-portal/customers/${id}/disable`);
      return data;
    },
  })
);
```

---

## Hooks Factory

### Location: `src/lib/hooks-factory.ts`

### Core Function: `createCrudHooks`

Creates React Query hooks for all CRUD operations.

```typescript
import { createCrudHooks } from "../lib/hooks-factory";

const hooks = createCrudHooks<Entity, CreateDto, UpdateDto, QueryParams>(
  "resourceName", // Used for query key prefixes
  service // The API service
);
```

### Generated Hooks

| Hook                    | Type     | Description                     |
| ----------------------- | -------- | ------------------------------- |
| `hooks.useList(query?)` | Query    | Fetch paginated list            |
| `hooks.useDetail(id)`   | Query    | Fetch single item               |
| `hooks.useCreate()`     | Mutation | Create new item                 |
| `hooks.useUpdate()`     | Mutation | Update existing item            |
| `hooks.useDelete()`     | Mutation | Delete item                     |
| `hooks.queryKeys`       | Object   | Query keys for cache management |

### Query Keys Structure

```typescript
hooks.queryKeys = {
  all: ["customers"], // Base key
  lists: () => ["customers", "list"], // All lists
  list: (q) => ["customers", "list", q], // Specific list query
  details: () => ["customers", "detail"], // All details
  detail: (id) => ["customers", "detail", id], // Specific item
};
```

---

## Step-by-Step: Adding a New Resource

### Example: Adding Inventory Service

#### Step 1: Define Types

```typescript
// src/types/inventory.ts

export interface Inventory {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  status: "active" | "inactive";
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryDto {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  status?: "active" | "inactive";
}

export interface UpdateInventoryDto extends Partial<CreateInventoryDto> {}

export interface ListInventoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: "active" | "inactive";
}
```

#### Step 2: Create API Service

```typescript
// src/services/inventory.ts

import { createCrudService } from "../lib/api-factory";
import type {
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
  ListInventoryQuery,
} from "../types/inventory";

export const inventoryService = createCrudService<
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
  ListInventoryQuery
>({
  baseUrl: "/agent-portal/inventory",
  fileFieldName: "image",
});
```

#### Step 3: Create Hooks

```typescript
// src/hooks/useInventory.ts

import { createCrudHooks } from "../lib/hooks-factory";
import { inventoryService } from "../services/inventory";
import type {
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
  ListInventoryQuery,
} from "../types/inventory";

const inventoryHooks = createCrudHooks<
  Inventory,
  CreateInventoryDto,
  UpdateInventoryDto,
  ListInventoryQuery
>("inventory", inventoryService);

// Export with clear names
export const inventoryKeys = inventoryHooks.queryKeys;
export const useInventoryList = inventoryHooks.useList;
export const useInventoryItem = inventoryHooks.useDetail;
export const useCreateInventory = inventoryHooks.useCreate;
export const useUpdateInventory = inventoryHooks.useUpdate;
export const useDeleteInventory = inventoryHooks.useDelete;
```

#### Step 4: Use in Components

```tsx
// src/features/inventory/InventoryPage.tsx

import { useInventoryList, useCreateInventory } from "../../hooks/useInventory";

const InventoryPage = () => {
  const { data, isLoading, error } = useInventoryList({ page: 1, limit: 10 });
  const createMutation = useCreateInventory();

  const handleCreate = async (formData: CreateInventoryDto) => {
    await createMutation.mutateAsync({ dto: formData });
    // Cache automatically invalidated!
  };

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data?.data.map((item) => (
        <InventoryCard key={item.id} item={item} />
      ))}
    </div>
  );
};
```

---

## Handling Custom Endpoints

### When Standard CRUD Isn't Enough

For endpoints like:

- `POST /customers/:id/enable`
- `POST /customers/:id/disable`
- `GET /customers/stats`
- `POST /inventory/:id/transfer`

### Pattern 1: Extend the Service

```typescript
// src/services/customer.ts

import { extendService } from "../lib/api-factory";
import { api } from "../lib/axios";

export const customerService = extendService<
  Customer,
  CreateDto,
  UpdateDto,
  QueryParams,
  {
    getStats(): Promise<CustomerStats>;
    enable(id: string): Promise<Customer>;
    disable(id: string): Promise<Customer>;
  }
>({ baseUrl: "/agent-portal/customers" }, () => ({
  async getStats() {
    const { data } = await api.get("/agent-portal/customers/stats");
    return data;
  },
  async enable(id: string) {
    const { data } = await api.patch(`/agent-portal/customers/${id}/enable`);
    return data;
  },
  async disable(id: string) {
    const { data } = await api.patch(`/agent-portal/customers/${id}/disable`);
    return data;
  },
}));
```

### Pattern 2: Add Custom Hooks

```typescript
// src/hooks/useCustomers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ... factory-generated hooks ...

// Custom query hook
export function useCustomerStats() {
  return useQuery({
    queryKey: [...customerKeys.all, "stats"],
    queryFn: () => customerService.getStats(),
  });
}

// Custom mutation hooks
export function useEnableCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.enable(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

export function useDisableCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.disable(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}
```

---

## Best Practices

### 1. Naming Conventions

```typescript
// Services: resourceService (singular)
export const customerService = ...;
export const inventoryService = ...;

// Hooks: useResource / useResources (singular/plural)
export const useCustomers = ...;      // List
export const useCustomer = ...;       // Detail
export const useCreateCustomer = ...; // Create
export const useUpdateCustomer = ...; // Update
export const useDeleteCustomer = ...; // Delete
```

### 2. Query Key Organization

Always use the factory-generated query keys for cache invalidation:

```typescript
// Good
queryClient.invalidateQueries({ queryKey: customerKeys.lists() });

// Bad - hardcoded strings
queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
```

### 3. Error Handling

Combine with toast notifications:

```typescript
const createMutation = useCreateCustomer();
const { showToast } = useToast();

const handleCreate = async (data: CreateDto) => {
  try {
    await createMutation.mutateAsync({ dto: data });
    showToast("Success", "Customer created!", "success");
  } catch (error: any) {
    showToast("Error", error.response?.data?.message || "Failed", "error");
  }
};
```

### 4. Optimistic Updates (Advanced)

```typescript
useMutation({
  mutationFn: (id: string) => customerService.enable(id),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: customerKeys.detail(id) });
    const previous = queryClient.getQueryData(customerKeys.detail(id));
    queryClient.setQueryData(customerKeys.detail(id), (old: Customer) => ({
      ...old,
      status: "active",
    }));
    return { previous };
  },
  onError: (_, id, context) => {
    queryClient.setQueryData(customerKeys.detail(id), context?.previous);
  },
  onSettled: (_, __, id) => {
    queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
  },
});
```

---

## Quick Reference

### Creating a Basic Service (No Custom Methods)

```typescript
// 5 lines
import { createCrudService } from "../lib/api-factory";
import type { Entity, CreateDto, UpdateDto, Query } from "../types/entity";

export const entityService = createCrudService<
  Entity,
  CreateDto,
  UpdateDto,
  Query
>({
  baseUrl: "/api/entities",
});
```

### Creating Hooks for a Basic Service

```typescript
// 12 lines
import { createCrudHooks } from "../lib/hooks-factory";
import { entityService } from "../services/entity";
import type { Entity, CreateDto, UpdateDto, Query } from "../types/entity";

const hooks = createCrudHooks<Entity, CreateDto, UpdateDto, Query>(
  "entities",
  entityService
);

export const entityKeys = hooks.queryKeys;
export const useEntities = hooks.useList;
export const useEntity = hooks.useDetail;
export const useCreateEntity = hooks.useCreate;
export const useUpdateEntity = hooks.useUpdate;
export const useDeleteEntity = hooks.useDelete;
```

### File Structure for a New Resource

```
src/
├── types/
│   └── inventory.ts      # Type definitions
├── services/
│   └── inventory.ts      # API service (5-20 lines)
└── hooks/
    └── useInventory.ts   # React Query hooks (12-30 lines)
```

---

## Summary

| Before (Manual)          | After (Factory)        |
| ------------------------ | ---------------------- |
| ~60 lines per service    | ~5-10 lines            |
| ~80 lines per hooks file | ~15 lines              |
| Copy-paste prone         | Single source of truth |
| Inconsistent patterns    | Enforced consistency   |

The factory pattern reduces boilerplate by **80%** while maintaining full type safety and flexibility for custom endpoints.
