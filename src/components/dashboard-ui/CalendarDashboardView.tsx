import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { InteractiveCalendar } from '../dashboard-ui/InteractiveCalendar';
import { Icon } from '@iconify/react';

const CalendarContent: React.FC = () => {
    const { token, isAuthenticated } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false);
    const API_URL = 'http://localhost:8000';

    const fetchEventos = async () => {
        if (!token) return;
        try {
            const response = await fetch(`${API_URL}/api/me/timeline/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (err) {
            console.error('Error fetching timeline:', err);
        }
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchEventos();
        }
    }, [isAuthenticated, token]);

    // Filter upcoming events (today and future)
    const upcomingEvents = events
        .filter(event => new Date(event.fecha_inicio) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());

    const sidebarEvents = upcomingEvents.slice(0, 3);

    const getEventColor = (tipo: string) => {
        switch (tipo) {
            case 'vuelo': return 'bg-blue-500';
            case 'hotel': return 'bg-purple-500';
            case 'actividad': return 'bg-green-500';
            case 'transporte': return 'bg-yellow-500';
            case 'recordatorio': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text mb-2">Mi Calendario de Viajes</h1>
                    <p className="text-text-muted max-w-2xl">
                        Gestiona tus itinerarios, reservas y actividades. Haz clic en cualquier fecha para añadir un nuevo evento.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Calendar Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden ring-1 ring-black/5">
                        <InteractiveCalendar />
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-6">
                    {/* Upcoming Events Card */}
                    <div className="bg-surface rounded-2xl shadow-sm border border-border p-6 ring-1 ring-black/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-text flex items-center gap-2">
                                <Icon icon="lucide:clock" className="text-primary w-5 h-5" />
                                Próximos Eventos
                            </h3>
                            {upcomingEvents.length > 0 && (
                                <button
                                    onClick={() => setIsAllEventsModalOpen(true)}
                                    className="text-primary text-xs font-semibold hover:underline"
                                >
                                    Ver todo
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {sidebarEvents.length > 0 ? (
                                sidebarEvents.map((event, i) => (
                                    <div key={i} className="flex gap-4 group cursor-pointer hover:bg-background/50 p-2 rounded-xl transition-colors">
                                        <div className={`w-1 rounded-full ${getEventColor(event.tipo)} transition-all group-hover:w-1.5`}></div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-text truncate">{event.titulo}</h4>
                                                {event.source === 'reservation' && (
                                                    <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-full font-bold shrink-0">VIAJE</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-text-muted">
                                                {new Date(event.fecha_inicio).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} · {new Date(event.fecha_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="self-center">
                                            <Icon icon="lucide:chevron-right" className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-text-muted text-center py-4 italic">No hay eventos próximos</p>
                            )}
                        </div>
                    </div>

                    {/* Travel Tip Card */}
                    <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                            <Icon icon="lucide:lightbulb" className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-text mb-2 text-sm italic">Consejo de Viajero</h4>
                        <p className="text-xs text-text-muted leading-relaxed">
                            No olvides subir tus comprobantes de pago en la sección de "Pagos" para asegurar que tus reservas se confirmen a tiempo.
                        </p>
                    </div>

                    {/* Quick Legend */}
                    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
                        <h4 className="font-bold text-text mb-4 text-sm">Organización</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Vuelos
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Hoteles
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Tours
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                Transportes
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Events Modal */}
            {isAllEventsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setIsAllEventsModalOpen(false)}>
                    <div className="bg-surface rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
                            <div>
                                <h3 className="text-xl font-bold text-text">Todos los Eventos Próximos</h3>
                                <p className="text-sm text-text-muted">{upcomingEvents.length} eventos encontrados</p>
                            </div>
                            <button onClick={() => setIsAllEventsModalOpen(false)} className="p-2 hover:bg-background rounded-full text-text-muted hover:text-text transition-colors">
                                <Icon icon="lucide:x" className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {upcomingEvents.map((event, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <div className={`w-12 h-12 rounded-xl ${getEventColor(event.tipo).replace('bg-', 'bg-')}/10 flex items-center justify-center shrink-0`}>
                                        <Icon
                                            icon={
                                                event.tipo === 'vuelo' ? 'lucide:plane' :
                                                    event.tipo === 'hotel' ? 'lucide:hotel' :
                                                        event.tipo === 'actividad' ? 'lucide:map-pin' :
                                                            event.tipo === 'transporte' ? 'lucide:car' : 'lucide:calendar'
                                            }
                                            className={`w-6 h-6 ${getEventColor(event.tipo).replace('bg-', 'text-')}`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-text group-hover:text-primary transition-colors">{event.titulo}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold text-white ${getEventColor(event.tipo)}`}>
                                                {event.tipo}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-muted mb-2">
                                            {event.descripcion || 'Sin descripción adicional'}
                                        </p>
                                        <div className="flex flex-wrap gap-4 items-center text-xs text-text-muted">
                                            <div className="flex items-center gap-1.5">
                                                <Icon icon="lucide:calendar" className="w-3.5 h-3.5" />
                                                {new Date(event.fecha_inicio).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Icon icon="lucide:clock" className="w-3.5 h-3.5" />
                                                {new Date(event.fecha_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {event.ubicacion && (
                                                <div className="flex items-center gap-1.5">
                                                    <Icon icon="lucide:map-pin" className="w-3.5 h-3.5" />
                                                    {event.ubicacion}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-border bg-background/50 flex justify-end">
                            <button
                                onClick={() => setIsAllEventsModalOpen(false)}
                                className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CalendarDashboardView: React.FC = () => {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <CalendarContent />
            </ProtectedRoute>
        </AuthProvider>
    );
};
