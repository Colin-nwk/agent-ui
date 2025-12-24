// Customer types based on backend schema

export type AddressType = 'HOME' | 'WORK' | 'OTHER';
export type UserStatus = 'active' | 'inactive' | 'barred';
export type CustomerType = 'lead' | 'purchase';

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  addressType: AddressType;
  image?: string;
  location?: string;
  longitude?: string;
  latitude?: string;
  landmark?: string;
  status: UserStatus;
  type: CustomerType;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerDto {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  addressType: AddressType;
  location: string;
  longitude?: string;
  latitude?: string;
  landmark?: string;
  status?: UserStatus;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export interface ListCustomersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  type?: CustomerType;
}

// API returns { customers: [...], total, pageNumber, limitNumber, totalPages }
export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  pageNumber: number;
  limitNumber: number;
  totalPages: number;
}

export interface CustomerStats {
  barredCustomerCount: number;
  newCustomerCount: number;
  activeCustomerCount: number;
  totalCustomerCount: number;
}
