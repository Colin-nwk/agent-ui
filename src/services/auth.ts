import { api } from '../lib/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  requestOtp: async (phone: string): Promise<void> => {
    // In dev mode, we might want to just simulate success
    // return api.post('/auth/otp', { phone });
    
    // For now, let's keep the simulation for dev until backend is ready
    // Remove this timeout and uncomment above line when API is real
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },

  verifyOtp: async (phone: string, otp: string): Promise<AuthResponse> => {
    // Real API call would be:
    // const { data } = await api.post<AuthResponse>('/auth/login', { phone, otp });
    // return data;

    // Simulate response for dev
    return new Promise((resolve) => 
      setTimeout(() => 
        resolve({
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '8821',
            name: 'Collins Nwoko',
            email: 'collins@ubuxa.com',
            phone,
            role: 'AGENT'
          }
        }), 1000)
    );
  },

  getCurrentUser: async (): Promise<User> => {
    // const { data } = await api.get<User>('/auth/me');
    // return data;
    
    // Simulate user
    return {
      id: '8821',
      name: 'Collins Nwoko',
      email: 'collins@ubuxa.com',
      phone: '+2348012345678',
      role: 'AGENT'
    };
  },

  logout: async (): Promise<void> => {
    // await api.post('/auth/logout');
    localStorage.removeItem('agent_token');
    localStorage.removeItem('agent_auth');
  }
};
