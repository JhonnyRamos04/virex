import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarEvent {
    id?: number;
    titulo: string;
    descripcion: string;
    tipo: 'vuelo' | 'hotel' | 'actividad' | 'transporte' | 'recordatorio' | 'otro';
    fecha_inicio: string; // ISO format
    fecha_fin?: string;
    todo_el_dia: boolean;
    ubicacion?: string;
}

const API_URL = 'http://localhost:8000';

export const InteractiveCalendar: React.FC = () => {
    const { token, isAuthenticated } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState<CalendarEvent>({
        titulo: '',
        descripcion: '',
        tipo: 'otro',
        fecha_inicio: '',
        fecha_fin: '',
        todo_el_dia: false,
        ubicacion: ''
    });

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Fetch eventos from API
    useEffect(() => {
        if (isAuthenticated && token) {
            fetchEventos();
        }
    }, [isAuthenticated, token]);

    const fetchEventos = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/api/eventos/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (err) {
            console.error('Error fetching eventos:', err);
        }
    };

    const createEvento = async (data: CalendarEvent) => {
        if (!token) return;

        setLoading(true);
        setError('');

        // Clean data: convert empty strings to null for optional fields
        const cleanedData = {
            ...data,
            fecha_fin: data.fecha_fin || null,
            ubicacion: data.ubicacion || null,
            descripcion: data.descripcion || null,
        };

        try {
            const response = await fetch(`${API_URL}/api/eventos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(cleanedData)
            });

            if (response.ok) {
                await fetchEventos();
                setIsModalOpen(false);
                resetForm();
            } else {
                const errorData = await response.json();
                console.error('Backend Error:', errorData);
                setError(typeof errorData === 'object' ? JSON.stringify(errorData) : errorData || 'Error al crear evento');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const updateEvento = async (id: number, data: CalendarEvent) => {
        if (!token) return;

        setLoading(true);
        setError('');

        // Clean data: convert empty strings to null for optional fields
        const cleanedData = {
            ...data,
            fecha_fin: data.fecha_fin || null,
            ubicacion: data.ubicacion || null,
            descripcion: data.descripcion || null,
        };

        try {
            const response = await fetch(`${API_URL}/api/eventos/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(cleanedData)
            });

            if (response.ok) {
                await fetchEventos();
                setIsModalOpen(false);
                setIsEditing(false);
                resetForm();
            } else {
                const errorData = await response.json();
                console.error('Backend Error:', errorData);
                setError(typeof errorData === 'object' ? JSON.stringify(errorData) : errorData || 'Error al actualizar evento');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const deleteEvento = async (id: number) => {
        if (!token || !confirm('¿Estás seguro de eliminar este evento?')) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/eventos/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.ok) {
                await fetchEventos();
                setIsModalOpen(false);
                setViewingEvent(null);
            }
        } catch (err) {
            console.error('Error deleting evento:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            titulo: '',
            descripcion: '',
            tipo: 'otro',
            fecha_inicio: '',
            fecha_fin: '',
            todo_el_dia: false,
            ubicacion: ''
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && viewingEvent?.id) {
            updateEvento(viewingEvent.id, formData);
        } else {
            createEvento(formData);
        }
    };

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const formatDateString = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const getEventsForDate = (date: Date) => {
        const dateString = formatDateString(date);
        return events.filter(event => {
            const eventDate = event.fecha_inicio.split('T')[0];
            return eventDate === dateString;
        });
    };

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const calendarDays = [];

    // Prev month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDay - 1; i >= 0; i--) {
        calendarDays.push({
            date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
            isCurrentMonth: false,
            dayNumber: daysInPrevMonth - i
        });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({
            date: new Date(currentYear, currentMonth, i),
            isCurrentMonth: true,
            dayNumber: i
        });
    }

    // Next month
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        calendarDays.push({
            date: new Date(nextYear, nextMonth, i),
            isCurrentMonth: false,
            dayNumber: i
        });
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
        setViewingEvent(null);
        setIsEditing(false);

        // Set date in form
        const dateString = formatDateString(date);
        setFormData({
            ...formData,
            fecha_inicio: `${dateString}T12:00:00`,
            fecha_fin: ''
        });
    };

    const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
        e.stopPropagation();
        setViewingEvent(event);
        setIsModalOpen(true);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        if (viewingEvent) {
            setFormData({
                titulo: viewingEvent.titulo,
                descripcion: viewingEvent.descripcion,
                tipo: viewingEvent.tipo,
                fecha_inicio: viewingEvent.fecha_inicio,
                fecha_fin: viewingEvent.fecha_fin || '',
                todo_el_dia: viewingEvent.todo_el_dia,
                ubicacion: viewingEvent.ubicacion || ''
            });
            setIsEditing(true);
        }
    };

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const getEventColor = (tipo: string) => {
        switch (tipo) {
            case 'vuelo':
                return 'bg-blue-500';
            case 'hotel':
                return 'bg-purple-500';
            case 'actividad':
                return 'bg-green-500';
            case 'transporte':
                return 'bg-yellow-500';
            case 'recordatorio':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    const tipoOptions = [
        { value: 'vuelo', label: 'Vuelo' },
        { value: 'hotel', label: 'Hotel/Alojamiento' },
        { value: 'actividad', label: 'Actividad Turística' },
        { value: 'transporte', label: 'Transporte' },
        { value: 'recordatorio', label: 'Recordatorio' },
        { value: 'otro', label: 'Otro' }
    ];

    if (!isAuthenticated) {
        return (
            <div className="bg-surface rounded-xl p-6 shadow-sm border border-border text-center">
                <Icon icon="lucide:lock" className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-text-muted">Inicia sesión para ver tu calendario</p>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-background rounded-lg border border-border transition-colors">
                    <Icon icon="lucide:chevron-left" />
                </button>
                <h2 className="text-xl font-semibold text-text">
                    {monthNames[currentMonth]} {currentYear}
                </h2>
                <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-background rounded-lg border border-border transition-colors">
                    <Icon icon="lucide:chevron-right" />
                </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-text-muted py-2">{day}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                    const dayEvents = getEventsForDate(day.date);
                    const isToday = formatDateString(day.date) === formatDateString(new Date());

                    return (
                        <div
                            key={idx}
                            onClick={() => handleDateClick(day.date)}
                            className={`
                                aspect-square min-h-16 p-2 border rounded-xl cursor-pointer transition-all relative flex flex-col items-center group
                                ${day.isCurrentMonth ? 'bg-background hover:bg-surface-2 border-border/50 hover:border-primary/30' : 'opacity-20 bg-background/50 border-transparent pointer-events-none'}
                                ${isToday ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : ''}
                                hover:shadow-md hover:-translate-y-0.5
                            `}
                        >
                            <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-text-muted group-hover:text-text'}`}>
                                {day.dayNumber}
                            </span>

                            {/* Event indicators */}
                            <div className="flex flex-col gap-1 mt-auto w-full overflow-hidden">
                                {dayEvents.slice(0, 2).map((evt) => (
                                    <div
                                        key={evt.id}
                                        onClick={(e) => handleEventClick(e, evt)}
                                        className={`w-full h-1.5 rounded-full ${getEventColor(evt.tipo)} opacity-80 hover:opacity-100 transition-opacity`}
                                        title={evt.titulo}
                                    />
                                ))}
                                {dayEvents.length > 2 && (
                                    <div className="flex justify-center">
                                        <span className="text-[0.6rem] font-bold text-text-muted">+{dayEvents.length - 2}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-4 text-sm text-text-muted">
                {tipoOptions.map(tipo => (
                    <div key={tipo.value} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getEventColor(tipo.value)}`}></div>
                        <span>{tipo.label}</span>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-text">
                                {viewingEvent && !isEditing ? viewingEvent.titulo : isEditing ? 'Editar Evento' : 'Nuevo Evento'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text">
                                <Icon icon="lucide:x" className="w-6 h-6" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
                                {error}
                            </div>
                        )}

                        {viewingEvent && !isEditing ? (
                            // View mode
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <span className={`px-2 py-0.5 rounded text-xs text-white capitalize ${getEventColor(viewingEvent.tipo)}`}>
                                        {viewingEvent.tipo}
                                    </span>
                                    <span>{new Date(viewingEvent.fecha_inicio).toLocaleString()}</span>
                                </div>

                                {viewingEvent.ubicacion && (
                                    <div className="flex items-center gap-2 text-text">
                                        <Icon icon="lucide:map-pin" className="w-4 h-4 text-primary" />
                                        <span>{viewingEvent.ubicacion}</span>
                                    </div>
                                )}

                                {viewingEvent.descripcion && (
                                    <p className="text-text-muted bg-background p-3 rounded-lg text-sm">
                                        {viewingEvent.descripcion}
                                    </p>
                                )}

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => viewingEvent.id && deleteEvento(viewingEvent.id)}
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                                    >
                                        Eliminar
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleEditClick}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Edit/Create mode
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Título</label>
                                    <input
                                        type="text"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Tipo</label>
                                    <select
                                        value={formData.tipo}
                                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {tipoOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Fecha y Hora</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.fecha_inicio}
                                        onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Ubicación (opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.ubicacion}
                                        onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Descripción</label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="todoElDia"
                                        checked={formData.todo_el_dia}
                                        onChange={(e) => setFormData({ ...formData, todo_el_dia: e.target.checked })}
                                        className="rounded border-border"
                                    />
                                    <label htmlFor="todoElDia" className="text-sm text-text">Todo el día</label>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => { setIsEditing(false); setViewingEvent(viewingEvent); }}
                                            className="px-4 py-2 border border-border rounded-md text-text hover:bg-background transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Evento'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
