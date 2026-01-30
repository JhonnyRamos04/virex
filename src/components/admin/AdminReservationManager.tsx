import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

interface Reservation {
    id: number;
    nombre_cliente: string;
    email_cliente: string;
    whatsapp: string;
    destino_nombre: string;
    estado: 'pendiente' | 'confirmado' | 'finalizada' | 'cancelado';
    fecha_creacion: string;
    mensaje_opcional?: string;
}

export const AdminReservationManager: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:8000/api/admin/reservas/', {
                headers: { 'Authorization': `Token ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setReservations(data);
            } else {
                setError("No se pudieron cargar las reservas. ¿Eres administrador?");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        setActionLoading(id);

        try {
            const response = await fetch(`http://localhost:8000/api/admin/reservas/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ estado: newStatus })
            });

            if (response.ok) {
                await fetchReservations();
            } else {
                alert("Error al actualizar el estado");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(null);
        }
    };

    const handleExportExcel = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        try {
            const response = await fetch('http://localhost:8000/api/admin/export-excel/?type=reserva', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reporte_reservas_${new Date().toISOString().split('T')[0]}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert("Error al exportar");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmado': return 'bg-blue-100 text-blue-700';
            case 'finalizada': return 'bg-green-100 text-green-700';
            case 'cancelado': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <Icon icon="lucide:download" className="w-4 h-4" />
                    Exportar Reservas (Excel)
                </button>
            </div>

            <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-background border-b border-border text-text-muted font-medium uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Ref</th>
                                <th className="px-6 py-4">Cliente / Contacto</th>
                                <th className="px-6 py-4">Destino</th>
                                <th className="px-6 py-4">Fecha Solicitud</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {reservations.map(res => (
                                <tr key={res.id} className="hover:bg-surface-2 transition-colors">
                                    <td className="px-6 py-4 font-mono font-medium text-text">#{res.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-text">{res.nombre_cliente}</span>
                                            <span className="text-xs text-text-muted">{res.email_cliente}</span>
                                            <span className="text-xs text-text-muted flex items-center gap-1">
                                                <Icon icon="lucide:phone" className="w-3 h-3" />
                                                {res.whatsapp}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                                            {res.destino_nombre}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted">
                                        {new Date(res.fecha_creacion).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(res.estado)}`}>
                                            {res.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            {res.estado === 'pendiente' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(res.id, 'confirmado')}
                                                    disabled={actionLoading === res.id}
                                                    className="p-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                                                >
                                                    Confirmar
                                                </button>
                                            )}
                                            {res.estado === 'confirmado' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(res.id, 'finalizada')}
                                                    disabled={actionLoading === res.id}
                                                    className="p-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors flex items-center gap-1"
                                                >
                                                    <Icon icon="lucide:check-circle" className="w-3 h-3" />
                                                    Finalizar
                                                </button>
                                            )}
                                            {res.estado !== 'cancelado' && res.estado !== 'finalizada' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(res.id, 'cancelado')}
                                                    disabled={actionLoading === res.id}
                                                    className="p-1 px-3 bg-red-100 hover:bg-red-200 text-red-600 rounded text-xs transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
