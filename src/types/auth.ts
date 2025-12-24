export interface AgentStore {
  id: string;
  name: string;
  phone: string;
  email: string;
  classification: string;
  isActive: boolean;
}

export interface AgentTenant {
  id: string;
  companyName: string;
  email: string;
  phone: string;
}

export interface User {
  id: string;
  agentId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  location: string | null;
  type: string;
  status: string;
  isTrusted: boolean;
  storeId: string;
  tenantId: string;
  store?: AgentStore;
  tenant?: AgentTenant;
}

export interface AuthResponse {
  access_token: string;
  agent: User;
  message: string;
}

export interface LoginParams {
  phoneNumber: string;
  otp: string;
}
