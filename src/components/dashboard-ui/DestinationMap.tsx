import React, { useState, useEffect } from 'react';
import { Map } from '@/components/Map';
import { Icon } from '@iconify/react';

interface Parada {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: string;
    latitud: string;
    longitud: string;
    imagen_url: string;
    orden: number;
}

interface Destination {
    id: number;
    titulo: string;
    descripcion: string;
    precio: string;
    imagen_url: string;
    latitud: string | null;
    longitud: string | null;
    paradas: Parada[];
}

const API_URL = 'http://localhost:8000';

export const DestinationMap: React.FC = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [selectedDestId, setSelectedDestId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await fetch(`${API_URL}/api/destinos/`);
                if (response.ok) {
                    const data = await response.json();
                    setDestinations(data);
                    if (data.length > 0) {
                        setSelectedDestId(data[0].id);
                    }
                }
            } catch (err) {
                console.error('Error fetching destinations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    const selectedDest = destinations.find(d => d.id === selectedDestId);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[400px] bg-surface rounded-xl border border-border">
                <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!selectedDest) {
        return (
            <div className="flex items-center justify-center h-[400px] bg-surface rounded-xl border border-border">
                <p className="text-text-muted">No hay destinos disponibles.</p>
            </div>
        );
    }

    // Map backend paradas to frontend PointOfInterest format
    const pois = selectedDest.paradas.map(p => ({
        id: p.id.toString(),
        location: [parseFloat(p.latitud), parseFloat(p.longitud)] as [number, number],
        title: p.nombre,
        description: p.descripcion,
        type: p.tipo as any,
        image: p.imagen_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    }));

    // Optionally create a route from the paradas if they have an order
    const routePoints = selectedDest.paradas
        .sort((a, b) => a.orden - b.orden)
        .map(p => [parseFloat(p.latitud), parseFloat(p.longitud)] as [number, number]);

    const routes = routePoints.length > 1 ? [{
        id: `route-${selectedDest.id}`,
        points: routePoints,
        color: '#3b82f6',
        name: `Ruta Turística: ${selectedDest.titulo}`
    }] : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-text">Mapa de Exploración</h2>
                        <p className="text-sm text-text-muted">Visualiza tu próximo destino y sus puntos clave.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="destination-select" className="text-sm font-medium text-text-muted whitespace-nowrap">
                            Cambiar a:
                        </label>
                        <select
                            id="destination-select"
                            value={selectedDestId || ''}
                            onChange={(e) => setSelectedDestId(Number(e.target.value))}
                            className="bg-surface border border-border text-text text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 transition-all hover:border-primary/50"
                        >
                            {destinations.map(dest => (
                                <option key={dest.id} value={dest.id}>{dest.titulo}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="relative group">
                    <Map
                        lat={selectedDest.latitud ? parseFloat(selectedDest.latitud) : 10.2469}
                        lng={selectedDest.longitud ? parseFloat(selectedDest.longitud) : -67.5958}
                        zoom={14}
                        markerTitle={`Punto de Partida: ${selectedDest.titulo}`}
                        routes={routes}
                        pointsOfInterest={pois}
                        className="h-[500px] w-full rounded-2xl shadow-xl border border-border/50 z-0"
                    />
                    <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md p-3 rounded-xl border border-border/50 shadow-lg text-xs font-semibold text-text pointer-events-none">
                        <Icon icon="lucide:navigation" className="inline-block mr-1 text-primary animate-pulse" />
                        Mostrando {pois.length} paradas turísticas
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-primary/10"></div>
                    <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                        <Icon icon="lucide:star" className="text-yellow-500 w-5 h-5" />
                        Lugares Destacados
                    </h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedDest.paradas.length > 0 ? (
                            selectedDest.paradas.sort((a, b) => a.orden - b.orden).map((parada) => (
                                <div key={parada.id} className="group cursor-pointer">
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-2 shadow-sm border border-border/50">
                                        <img
                                            src={parada.imagen_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80'}
                                            alt={parada.nombre}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                            {parada.tipo}
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors">{parada.nombre}</h4>
                                    <p className="text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">{parada.descripcion}</p>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center bg-background/50 rounded-xl border border-dashed border-border">
                                <Icon icon="lucide:map" className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-30" />
                                <p className="text-xs text-text-muted px-4">Aún no hay paradas turísticas cargadas para este destino.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5">
                    <h4 className="font-bold text-text mb-2 text-sm">¿Cómo funciona?</h4>
                    <p className="text-xs text-text-muted leading-relaxed">
                        Cada marcador en el mapa representa un punto clave de tu viaje. Las rutas conectan estos puntos en el orden recomendado.
                    </p>
                </div>
            </div>
        </div>
    );
};
