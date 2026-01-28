import React from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import { LoginForm } from '../forms/LoginForm';

export const LoginView: React.FC = () => {
    return (
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    );
};
