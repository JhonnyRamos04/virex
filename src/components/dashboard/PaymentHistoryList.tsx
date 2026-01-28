import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

interface Payment {
    id: number;
    monto: string; // Decimal string from API
    referencia: string;
    fecha_pago: string;
    estado: string;
    metodo_pago: number;
    metodo_pago_nombre: string;
    reserva_cliente: string;
    notas?: string;
}

export const PaymentHistoryList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/pagos/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPayments(data);
                } else {
                    console.error("Failed to fetch payments");
                }
            } catch (err) {
                console.error("Error fetching payments:", err);
                setError("No se pudo cargar el historial.");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Stats Calculation
    const totalPaid = payments
        .filter(p => p.estado === 'verificado' || p.estado === 'confirmado') // API might return verificado or confirmado depending on choices
        .reduce((sum, p) => sum + parseFloat(p.monto), 0);

    const pendingPayments = payments.filter(p => p.estado === 'pendiente').length;
    const completedPayments = payments.filter(p => p.estado === 'verificado' || p.estado === 'confirmado').length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verificado':
            case 'confirmado': return 'text-green-600 bg-green-50 border-green-200';
            case 'pendiente': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'rechazado':
            case 'failed': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getMethodIcon = (methodName: string) => {
        const m = methodName ? methodName.toLowerCase() : '';
        if (m.includes('zelle')) return 'simple-icons:zelle';
        if (m.includes('paypal')) return 'simple-icons:paypal';
        if (m.includes('movil') || m.includes('móvil')) return 'lucide:smartphone';
        if (m.includes('efectivo')) return 'lucide:wallet';
        return 'lucide:credit-card';
    };

    if (loading) return <div className="p-8 text-center text-text-muted">Cargando pagos...</div>;

    return (
        <div className="flex flex-col gap-8">
            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex gap-4 p-6 bg-surface border border-border rounded-2xl hover:border-primary hover:shadow-sm transition-all">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                        <Icon icon="lucide:check-circle" className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-text-muted">Pagos Completados</span>
                        <span className="text-2xl font-bold text-text">{completedPayments}</span>
                    </div>
                </div>

                <div className="flex gap-4 p-6 bg-surface border border-border rounded-2xl hover:border-primary hover:shadow-sm transition-all">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600">
                        <Icon icon="lucide:clock" className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-text-muted">Pagos Pendientes</span>
                        <span className="text-2xl font-bold text-text">{pendingPayments}</span>
                    </div>
                </div>

                <div className="flex gap-4 p-6 bg-surface border border-border rounded-2xl hover:border-primary hover:shadow-sm transition-all">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon icon="lucide:dollar-sign" className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-text-muted">Total Pagado</span>
                        <span className="text-2xl font-bold text-text">${totalPaid.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Payment History List */}
            <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold text-text">Transacciones Recientes</h3>
                    <p className="text-sm text-text-muted">Últimos movimientos de pago</p>
                </div>

                <div className="divide-y divide-border">
                    {payments.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">
                            No hay pagos registrados.
                        </div>
                    ) : (
                        payments.map((payment) => (
                            <div key={payment.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-full bg-surface border border-border shrink-0">
                                        <Icon icon={getMethodIcon(payment.metodo_pago_nombre)} className="w-6 h-6 text-text-muted" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-text">Pago de Reserva - {payment.metodo_pago_nombre}</h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <Icon icon="lucide:calendar" className="w-3.5 h-3.5" />
                                                {new Date(payment.fecha_pago).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Icon icon="lucide:hash" className="w-3.5 h-3.5" />
                                                {payment.referencia}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(payment.estado)}`}>
                                        {payment.estado}
                                    </span>
                                    <span className="text-lg font-bold text-text">
                                        ${parseFloat(payment.monto).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
