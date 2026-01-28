import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function RegisterForm() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            await register(email, password, nombre);
            // Redirigir al dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 rounded-md bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800">
                    <p className="text-red-900 dark:text-red-100 font-medium">Error</p>
                    <p className="text-red-800 dark:text-red-300 text-sm mt-1">{error}</p>
                </div>
            )}

            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-text mb-2">
                    Nombre completo
                </label>
                <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder="Juan Pablo ramirez"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder="legoat@ejemplo.com"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder="••••••••"
                    minLength={6}
                />
                <p className="mt-1 text-sm text-text-muted">Mínimo 6 caracteres</p>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
                    Confirmar contraseña
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer px-6 py-3 rounded-md bg-primary text-white font-medium hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin inline-block w-5 h-5 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Registrando...
                    </>
                ) : (
                    'Crear cuenta'
                )}
            </button>

            <p className="text-center text-sm text-text-muted">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
                    Inicia sesión aquí
                </a>
            </p>
        </form>
    );
}
