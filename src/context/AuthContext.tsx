import { createContext, useContext, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, User } from '../services/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (params: { phone: string; otp: string }) => Promise<void>;
    requestOtp: (phone: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: async () => { },
    requestOtp: async () => { },
    logout: () => { },
    isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem('agent_token');

    // Query for current user data
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: authService.getCurrentUser,
        enabled: !!token, // Only fetch if we have a token
        retry: false,
    });

    const otpMutation = useMutation({
        mutationFn: authService.requestOtp,
    });

    const loginMutation = useMutation({
        mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
            authService.verifyOtp(phone, otp),
        onSuccess: (data) => {
            localStorage.setItem('agent_token', data.token);
            localStorage.setItem('agent_auth', 'true');
            queryClient.setQueryData(['auth', 'user'], data.user);
        },
    });

    const logout = () => {
        authService.logout();
        queryClient.setQueryData(['auth', 'user'], null);
        queryClient.removeQueries({ queryKey: ['auth'] });
    };

    const isAuthenticated = !!user || !!token;

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user: user || null,
                login: async (params) => { await loginMutation.mutateAsync(params); },
                requestOtp: async (phone) => { await otpMutation.mutateAsync(phone); },
                logout,
                isLoading: isUserLoading || loginMutation.isPending || otpMutation.isPending
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
