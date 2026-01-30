import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Icon } from '@iconify/react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

interface StatsData {
    metrics: {
        total_usuarios: number;
        total_ingresos: number;
        total_reservas: number;
    };
    reservas_por_estado: { estado: string; value: number }[];
    top_destinos: { titulo: string; value: number }[];
    ingresos_mensuales: { name: string; total: number }[];
}

export const AdminStatsDashboard: React.FC = () => {
    const [data, setData] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const API_BASE = 'http://localhost:8000';

    const fetchStats = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE}/api/admin/stats/`, {
                headers: { Authorization: `Token ${token}` },
            });
            if (response.ok) {
                const stats = await response.json();
                setData(stats);
            }
        } catch (err) {
            console.error('Error fetching admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Icon icon="lucide:loader-2" className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return <p>No hay datos disponibles</p>;

    const revenuesData = {
        labels: data.ingresos_mensuales.map((item) => item.name),
        datasets: [
            {
                label: 'Ingresos ($)',
                data: data.ingresos_mensuales.map((item) => item.total),
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 1,
            },
        ],
    };

    const statusData = {
        labels: data.reservas_por_estado.map((item) => item.estado),
        datasets: [
            {
                data: data.reservas_por_estado.map((item) => item.value),
                backgroundColor: [
                    'rgba(234, 179, 8, 0.6)', // pendiente
                    'rgba(34, 197, 94, 0.6)', // confirmado
                    'rgba(239, 68, 68, 0.6)',   // cancelado
                ],
                borderWidth: 1,
            },
        ],
    };

    const destinationsData = {
        labels: data.top_destinos.map((item) => item.titulo),
        datasets: [
            {
                label: 'Número de Reservas',
                data: data.top_destinos.map((item) => item.value),
                backgroundColor: 'rgba(168, 85, 247, 0.6)',
                borderColor: 'rgb(168, 85, 247)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text">Panel de Estadísticas</h1>
                    <p className="text-text-muted">Visualización de datos reales del sistema en tiempo real.</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="p-2 bg-surface hover:bg-background border border-border rounded-lg transition-colors"
                >
                    <Icon icon="lucide:refresh-cw" className="w-5 h-5 text-text-muted" />
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm ring-1 ring-black/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Icon icon="lucide:users" className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-text-muted font-medium">Usuarios Registrados</p>
                        <h3 className="text-2xl font-bold text-text">{data.metrics.total_usuarios}</h3>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm ring-1 ring-black/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                        <Icon icon="lucide:dollar-sign" className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-text-muted font-medium">Ingresos Totales (Verificados)</p>
                        <h3 className="text-2xl font-bold text-text">${data.metrics.total_ingresos.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm ring-1 ring-black/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Icon icon="lucide:calendar-check" className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-text-muted font-medium">Reservas Realizadas</p>
                        <h3 className="text-2xl font-bold text-text">{data.metrics.total_reservas}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Revenue Chart */}
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm ring-1 ring-black/5">
                    <h3 className="text-lg font-bold text-text mb-6">Ingresos Mensuales</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <Bar
                            data={revenuesData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            }}
                        />
                    </div>
                </div>

                {/* Reservation Status Chart */}
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm ring-1 ring-black/5">
                    <h3 className="text-lg font-bold text-text mb-6">Estado de las Reservas</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <Pie
                            data={statusData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>

                {/* Top Destinations Chart */}
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm ring-1 ring-black/5 lg:col-span-2">
                    <h3 className="text-lg font-bold text-text mb-6">Destinos más Populares</h3>
                    <div className="h-[350px]">
                        <Bar
                            data={destinationsData}
                            options={{
                                indexAxis: 'y' as const,
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
