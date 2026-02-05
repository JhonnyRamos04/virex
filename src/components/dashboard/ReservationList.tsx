import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

interface Reservation {
    id: number;
    destination_titulo?: string; // Adjust based on actual API response
    destino_info?: {
        titulo: string;
        imagen_url?: string;
    };
    fecha_creacion: string;
    estado: string;
    nombre_cliente: string;
}

interface Trip {
    id: number;
    title: string;
    destination: string;
    date: Date;
    status: string;
}

export const ReservationList: React.FC = () => {
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/reservas/me/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data: Reservation[] = await response.json();
                    if (data.length > 0) {
                        const last = data[0];
                        setTrip({
                            id: last.id,
                            title: last.destino_info?.titulo || last.destination_titulo || "Viaje a Destino",
                            destination: last.destino_info?.titulo || last.destination_titulo || "Destino",
                            date: new Date(last.fecha_creacion),
                            status: last.estado
                        });
                    }
                } else {
                    console.error("Failed to fetch reservations");
                }
            } catch (err) {
                console.error("Error fetching:", err);
                setError("No se pudieron cargar tus reservas.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysUntil = (date: Date) => {
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) return <div className="p-8 text-center text-text-muted">Cargando tu destino...</div>;

    if (!trip) {
        return (
            <div className="bg-surface border border-border rounded-xl p-8 text-center flex flex-col items-center">
                <Icon icon="lucide:map" className="w-16 h-16 text-text-muted mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-text mb-2">No hay destinos reservados</h3>
                <p className="text-text-muted mb-6">Explora nuestros destinos populares y reserva tu próxima aventura.</p>
                <a href="/dashboard/destinations" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors no-underline font-medium">
                    Ver Destinos
                </a>
            </div>
        );
    }

    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 flex flex-col gap-8">
                {/* Trip Header */}
                <div className="flex flex-col md:flex-row gap-6 pb-8 border-b border-border">
                    <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-primary text-white rounded-2xl">
                        <Icon icon="lucide:plane" className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-text mb-2">{trip.title}</h2>
                        <p className="text-lg text-text-muted mb-3">{trip.destination}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex gap-4 p-4 bg-background rounded-lg border border-border">
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-surface border border-border rounded-lg text-primary">
                            <Icon icon="lucide:calendar" className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Fecha de Salida</span>
                            <span className="font-medium text-text text-sm">{formatDate(trip.date)}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-background rounded-lg border border-border">
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-surface border border-border rounded-lg text-primary">
                            <Icon icon="lucide:map-pin" className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Ubicación</span>
                            <span className="font-medium text-text text-sm">{trip.destination}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-background/50 border-t border-border">
                <h3 className="text-base font-semibold text-text mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/dashboard/tourist-map" className="flex flex-col items-center gap-2 p-4 bg-surface border border-border rounded-lg hover:border-primary hover:text-primary hover:shadow-md transition-all text-text no-underline group">
                        <Icon icon="lucide:map" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Ver Mapa</span>
                    </a>
                    <a href="/dashboard/calendar" className="flex flex-col items-center gap-2 p-4 bg-surface border border-border rounded-lg hover:border-primary hover:text-primary hover:shadow-md transition-all text-text no-underline group">
                        <Icon icon="lucide:calendar" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Ver Calendario</span>
                    </a>
                    <a href="/dashboard/payments" className="flex flex-col items-center gap-2 p-4 bg-surface border border-border rounded-lg hover:border-primary hover:text-primary hover:shadow-md transition-all text-text no-underline group">
                        <Icon icon="lucide:credit-card" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Ver Pagos</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
