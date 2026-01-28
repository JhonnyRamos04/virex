import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    id: number;
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, nombre: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8000';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar token y user desde localStorage al iniciar
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('authUser');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al iniciar sesión');
        }

        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        document.cookie = `session_token=${data.token}; path=/; SameSite=Lax`;
    };

    const register = async (email: string, password: string, nombre: string) => {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nombre })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al registrarse');
        }

        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        document.cookie = `session_token=${data.token}; path=/; SameSite=Lax`;
    };

    const logout = async () => {
        if (token) {
            try {
                await fetch(`${API_URL}/auth/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        }

        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        document.cookie = 'session_token=; path=/; max-age=0;';
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            register,
            logout,
            isAuthenticated: !!token,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
