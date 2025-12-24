import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: { name: string; id: string } | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ name: string; id: string } | null>(null);

    useEffect(() => {
        // Check auth on mount
        const isAuth = localStorage.getItem('agent_auth') === 'true';
        setIsAuthenticated(isAuth);
        if (isAuth) {
            setUser({ name: 'Collins Nwoko', id: '8821' });
        }
    }, []);

    const login = () => {
        localStorage.setItem('agent_auth', 'true');
        setIsAuthenticated(true);
        setUser({ name: 'Collins Nwoko', id: '8821' });
    };

    const logout = () => {
        localStorage.removeItem('agent_auth');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
