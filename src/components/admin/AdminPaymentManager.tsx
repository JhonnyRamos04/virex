import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

interface Payment {
    id: number;
    monto: string;
    referencia: string;
    fecha_pago: string;
    estado: string;
    metodo_pago: number;
    metodo_pago_nombre: string;
    reserva_cliente: string;
    comprobante?: string;
}

export const AdminPaymentManager: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            // Using the new ADMIN endpoint which lists ALL payments
            const response = await fetch('http://localhost:8000/api/admin/pagos/', {
                headers: { 'Authorization': `Token ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setPayments(data);
            } else {
                setError("Failed to fetch payments. Are you an admin?");
            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        setActionLoading(id);

        try {
            const response = await fetch(`http://localhost:8000/api/admin/pagos/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ estado: newStatus, fecha_verificacion: new Date().toISOString() })
            });

            if (response.ok) {
                // Refresh list
                await fetchPayments();
            } else {
                alert("Error updating status");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div>Cargando pagos del sistema...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-background border-b border-border text-text-muted font-medium">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Monto ($)</th>
                            <th className="px-6 py-4">Referencia</th>
                            <th className="px-6 py-4">Método</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {payments.map(payment => (
                            <tr key={payment.id} className="hover:bg-surface-2 transition-colors">
                                <td className="px-6 py-4 font-medium text-text">#{payment.id}</td>
                                <td className="px-6 py-4 text-text">{payment.reserva_cliente}</td>
                                <td className="px-6 py-4 text-text font-bold">${parseFloat(payment.monto).toLocaleString()}</td>
                                <td className="px-6 py-4 text-text-muted font-mono">{payment.referencia}</td>
                                <td className="px-6 py-4 text-text">{payment.metodo_pago_nombre}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${payment.estado === 'verificado' ? 'bg-green-100 text-green-700' :
                                            payment.estado === 'rechazado' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {payment.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {payment.estado === 'pendiente' && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(payment.id, 'verificado')}
                                                disabled={actionLoading === payment.id}
                                                className="p-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                                            >
                                                Verificar
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(payment.id, 'rechazado')}
                                                disabled={actionLoading === payment.id}
                                                className="p-1 px-3 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
