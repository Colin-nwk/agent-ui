import { api } from '../lib/axios';
import { AuthResponse, User, LoginParams } from '../types/auth';

export const authService = {
  requestOtp: async (phoneNumber: string): Promise<{ message: string }> => {
    const { data } = await api.post('/agent-portal/auth/request-otp', { phoneNumber });
    return data;
  },

  verifyOtp: async (params: LoginParams): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/agent-portal/auth/verify-otp', params);
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/agent-portal/auth/profile');
    return data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('agent_token');
    localStorage.removeItem('agent_auth');
  }
};
