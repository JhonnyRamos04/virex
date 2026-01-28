import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
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
                    placeholder="tu@ejemplo.com"
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
                    autoComplete="current-password"
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
                        Iniciando sesión...
                    </>
                ) : (
                    'Iniciar sesión'
                )}
            </button>

            <p className="text-center text-sm text-text-muted">
                ¿No tienes cuenta?{' '}
                <a href="/register" className="font-medium text-primary hover:text-primary-dark transition-colors">
                    Regístrate aquí
                </a>
            </p>
        </form>
    );
}
