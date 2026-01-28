import React from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import { RegisterForm } from '../forms/RegisterForm';

export const RegisterView: React.FC = () => {
    return (
        <AuthProvider>
            <RegisterForm />
        </AuthProvider>
    );
};
