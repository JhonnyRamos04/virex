import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface Destination {
    id: number;
    titulo: string;
    descripcion: string;
    precio: string;
    imagen_url: string;
    disponible: boolean;
    latitud: string;
    longitud: string;
}

interface TouristStop {
    id: number;
    nombre: string;
    descripcion: string;
    latitud: string;
    longitud: string;
    imagen_url: string;
    tipo: string;
    orden: number;
    destino: number;
}

export const AdminDestinationManager: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [touristStops, setTouristStops] = useState<TouristStop[]>([]);
    const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    // Form mode: 'create' or 'edit'
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [editingId, setEditingId] = useState<number | null>(null);

    // Destination Form States
    const [titulo, setTitulo] = useState('');
    const [desc, setDesc] = useState('');
    const [precio, setPrecio] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [desLat, setDesLat] = useState('');
    const [desLng, setDesLng] = useState('');
    const [disponible, setDisponible] = useState(true);

    // Tourist Stop States
    const [stopFormMode, setStopFormMode] = useState<'create' | 'edit'>('create');
    const [editingStopId, setEditingStopId] = useState<number | null>(null);
    const [selectedDestino, setSelectedDestino] = useState('');
    const [stopName, setStopName] = useState('');
    const [stopDesc, setStopDesc] = useState('');
    const [stopLat, setStopLat] = useState('');
    const [stopLng, setStopLng] = useState('');
    const [stopImg, setStopImg] = useState('');
    const [stopTipo, setStopTipo] = useState('otro');
    const [stopOrden, setStopOrden] = useState('0');

    const API_BASE = 'http://localhost:8000';

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const fetchDestinations = async () => {
        const token = getAuthToken();
        try {
            const response = await fetch(`${API_BASE}/api/destinos/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDestinations(data);
            }
        } catch (err) {
            console.error("Error loading destinations", err);
        }
    };

    const fetchTouristStops = async (destinoId?: string) => {
        const token = getAuthToken();
        const url = destinoId
            ? `${API_BASE}/api/paradas/?destino=${destinoId}`
            : `${API_BASE}/api/paradas/`;
        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTouristStops(data);
            }
        } catch (err) {
            console.error("Error loading tourist stops", err);
        }
    };

    const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>, type: 'destino' | 'parada') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = getAuthToken();
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/admin/import-excel/?type=${type}`, {
                method: 'POST',
                headers: { 'Authorization': `Token ${token}` },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                setFeedback({ msg: result.message, type: 'success' });
                fetchDestinations();
                fetchTouristStops();
            } else {
                const error = await response.json();
                setFeedback({ msg: error.error || "Error al importar", type: 'error' });
            }
        } catch (err) {
            setFeedback({ msg: "Error de conexión", type: 'error' });
        } finally {
            setLoading(false);
            // Reset input
            e.target.value = '';
        }
    };

    useEffect(() => {
        fetchDestinations();
        fetchTouristStops();
    }, []);

    // Watch selected destination changes to update tourist stops
    useEffect(() => {
        if (selectedDestino) {
            fetchTouristStops(selectedDestino);
        }
    }, [selectedDestino]);

    const resetDestinationForm = () => {
        setTitulo('');
        setDesc('');
        setPrecio('');
        setImgUrl('');
        setDesLat('');
        setDesLng('');
        setDisponible(true);
        setFormMode('create');
        setEditingId(null);
    };

    const resetStopForm = () => {
        setStopName('');
        setStopDesc('');
        setStopLat('');
        setStopLng('');
        setStopImg('');
        setStopTipo('otro');
        setStopOrden('0');
        setStopFormMode('create');
        setEditingStopId(null);
    };

    const handleEditDestination = (dest: Destination) => {
        setTitulo(dest.titulo);
        setDesc(dest.descripcion);
        setPrecio(dest.precio);
        setImgUrl(dest.imagen_url);
        setDesLat(dest.latitud);
        setDesLng(dest.longitud);
        setDisponible(dest.disponible);
        setFormMode('edit');
        setEditingId(dest.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleDisponible = async (dest: Destination) => {
        const token = getAuthToken();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/destinos/${dest.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    disponible: !dest.disponible
                })
            });

            if (res.ok) {
                setFeedback({
                    msg: `Destino ${!dest.disponible ? 'activado' : 'desactivado'} con éxito`,
                    type: 'success'
                });
                fetchDestinations();
            } else {
                setFeedback({ msg: 'Error al actualizar destino', type: 'error' });
            }
        } catch (e) {
            setFeedback({ msg: 'Error de conexión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitDestination = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        const token = getAuthToken();
        const url = formMode === 'edit'
            ? `${API_BASE}/api/destinos/${editingId}/`
            : `${API_BASE}/api/destinos/`;

        const method = formMode === 'edit' ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    titulo,
                    descripcion: desc,
                    precio: parseFloat(precio),
                    imagen_url: imgUrl,
                    disponible,
                    latitud: parseFloat(desLat),
                    longitud: parseFloat(desLng),
                })
            });

            if (res.ok) {
                setFeedback({
                    msg: formMode === 'edit' ? 'Destino actualizado con éxito' : 'Destino creado con éxito',
                    type: 'success'
                });
                resetDestinationForm();
                fetchDestinations();
            } else {
                setFeedback({ msg: 'Error al guardar destino', type: 'error' });
            }
        } catch (e) {
            setFeedback({ msg: 'Error de conexión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditStop = (stop: TouristStop) => {
        setSelectedDestino(stop.destino.toString());
        setStopName(stop.nombre);
        setStopDesc(stop.descripcion);
        setStopLat(stop.latitud);
        setStopLng(stop.longitud);
        setStopImg(stop.imagen_url);
        setStopTipo(stop.tipo);
        setStopOrden(stop.orden.toString());
        setStopFormMode('edit');
        setEditingStopId(stop.id);
        window.scrollTo({ top: document.getElementById('stop-form')?.offsetTop || 0, behavior: 'smooth' });
    };

    const handleDeleteStop = async (stopId: number) => {
        if (!confirm('¿Estás seguro de eliminar esta parada turística?')) return;

        const token = getAuthToken();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/paradas/${stopId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (res.ok) {
                setFeedback({ msg: 'Parada eliminada con éxito', type: 'success' });
                fetchTouristStops(selectedDestino);
            } else {
                setFeedback({ msg: 'Error al eliminar parada', type: 'error' });
            }
        } catch (e) {
            setFeedback({ msg: 'Error de conexión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitStop = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        const token = getAuthToken();
        const url = stopFormMode === 'edit'
            ? `${API_BASE}/api/paradas/${editingStopId}/`
            : `${API_BASE}/api/paradas/`;

        const method = stopFormMode === 'edit' ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    destino: selectedDestino,
                    nombre: stopName,
                    descripcion: stopDesc,
                    latitud: parseFloat(stopLat),
                    longitud: parseFloat(stopLng),
                    imagen_url: stopImg,
                    tipo: stopTipo,
                    orden: parseInt(stopOrden)
                })
            });

            if (res.ok) {
                setFeedback({
                    msg: stopFormMode === 'edit' ? 'Parada actualizada con éxito' : 'Parada agregada con éxito',
                    type: 'success'
                });
                resetStopForm();
                fetchTouristStops(selectedDestino);
            } else {
                setFeedback({ msg: 'Error al guardar parada', type: 'error' });
            }
        } catch (e) {
            setFeedback({ msg: 'Error de conexión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-0 pt-8 pb-12">
            {/* Header / Massive Upload */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-sm ring-1 ring-black/5">
                <div>
                    <h1 className="text-3xl font-bold text-text">Gestión de Destinos</h1>
                    <p className="text-text-muted">Administra destinos y paradas. Usa Excel para cargas masivas.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl cursor-pointer transition-all text-sm font-bold">
                        <Icon icon="lucide:file-up" className="w-4 h-4" />
                        <span>Importar Destinos</span>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={(e) => handleImportExcel(e, 'destino')}
                        />
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 border border-green-500/20 rounded-xl cursor-pointer transition-all text-sm font-bold">
                        <Icon icon="lucide:map-pin" className="w-4 h-4" />
                        <span>Importar Paradas</span>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={(e) => handleImportExcel(e, 'parada')}
                        />
                    </label>
                </div>
            </div>

            {/* DESTINATION FORM */}
            <div className="bg-surface border border-border rounded-xl p-4 sm:p-8 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text flex items-center gap-2">
                        <Icon icon="lucide:map-pin" />
                        {formMode === 'edit' ? 'Editar Destino' : 'Agregar Nuevo Destino'}
                    </h2>
                    {formMode === 'edit' && (
                        <button
                            onClick={resetDestinationForm}
                            className="text-sm text-muted hover:text-text flex items-center gap-1"
                        >
                            <Icon icon="lucide:x" />
                            Cancelar
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmitDestination} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text">Título</label>
                        <input value={titulo} onChange={e => setTitulo(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text">Descripción</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" rows={3} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Precio ($)</label>
                            <input type="number" step="0.01" value={precio} onChange={e => setPrecio(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Imagen URL</label>
                            <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} required placeholder="https://..." className="w-full p-2 border border-border rounded-lg bg-background text-text focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Latitud</label>
                            <input type="number" step="any" value={desLat} onChange={e => setDesLat(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text focus:ring-2 focus:ring-primary outline-none" placeholder="10.4806" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Longitud</label>
                            <input type="number" step="any" value={desLng} onChange={e => setDesLng(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text focus:ring-2 focus:ring-primary outline-none" placeholder="-66.9036" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="disponible"
                            checked={disponible}
                            onChange={e => setDisponible(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="disponible" className="text-sm font-medium text-text">Disponible</label>
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors">
                        {loading ? 'Guardando...' : (formMode === 'edit' ? 'Actualizar Destino' : 'Crear Destino')}
                    </button>
                </form>
            </div>

            {/* DESTINATIONS LIST */}
            <div className="bg-surface border border-border rounded-xl p-4 sm:p-8 shadow-sm ring-1 ring-black/5">
                <h2 className="text-xl font-bold mb-6 text-text flex items-center gap-2">
                    <Icon icon="lucide:list" />
                    Destinos Existentes
                </h2>
                <div className="space-y-4">
                    {destinations.length === 0 ? (
                        <p className="text-muted text-center py-8">No hay destinos creados aún</p>
                    ) : (
                        destinations.map(dest => (
                            <div key={dest.id} className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-text flex items-center gap-2 truncate">
                                        {dest.titulo}
                                        {!dest.disponible && (
                                            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">Desactivado</span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-text-muted line-clamp-1">{dest.descripcion}</p>
                                    <p className="text-sm font-bold text-primary mt-1">${dest.precio}</p>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <button
                                        onClick={() => handleEditDestination(dest)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Icon icon="lucide:pencil" className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleDisponible(dest)}
                                        className={`p-2 rounded-lg transition-colors ${dest.disponible
                                            ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950'
                                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950'
                                            }`}
                                        title={dest.disponible ? 'Desactivar' : 'Activar'}
                                    >
                                        <Icon icon={dest.disponible ? 'lucide:eye-off' : 'lucide:eye'} className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* TOURIST STOP FORM */}
            <div id="stop-form" className="bg-surface border border-border rounded-xl p-4 sm:p-8 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text flex items-center gap-2">
                        <Icon icon="lucide:map" />
                        {stopFormMode === 'edit' ? 'Editar Parada Turística' : 'Agregar Parada Turística'}
                    </h2>
                    {stopFormMode === 'edit' && (
                        <button
                            onClick={resetStopForm}
                            className="text-sm text-muted hover:text-text flex items-center gap-1"
                        >
                            <Icon icon="lucide:x" />
                            Cancelar
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmitStop} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text">Seleccionar Destino</label>
                        <select
                            value={selectedDestino}
                            onChange={e => setSelectedDestino(e.target.value)}
                            required
                            className="w-full p-2 border border-border rounded-lg bg-background text-text"
                        >
                            <option value="">-- Seleccionar --</option>
                            {destinations.map((d: any) => (
                                <option key={d.id} value={d.id}>{d.titulo}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-text">Nombre de la Parada</label>
                        <input value={stopName} onChange={e => setStopName(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-text">Descripción</label>
                        <textarea value={stopDesc} onChange={e => setStopDesc(e.target.value)} className="w-full p-2 border border-border rounded-lg bg-background text-text" rows={2} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Tipo</label>
                            <select
                                value={stopTipo}
                                onChange={e => setStopTipo(e.target.value)}
                                className="w-full p-2 border border-border rounded-lg bg-background text-text focus:ring-2 focus:ring-secondary outline-none"
                            >
                                <option value="restaurante">Restaurante</option>
                                <option value="museo">Museo</option>
                                <option value="playa">Playa</option>
                                <option value="monumento">Monumento</option>
                                <option value="parque">Parque</option>
                                <option value="mirador">Mirador</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Orden</label>
                            <input type="number" value={stopOrden} onChange={e => setStopOrden(e.target.value)} className="w-full p-2 border border-border rounded-lg bg-background text-text focus:ring-2 focus:ring-secondary outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Latitud</label>
                            <input type="number" step="any" value={stopLat} onChange={e => setStopLat(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text focus:ring-2 focus:ring-secondary outline-none" placeholder="10.4806" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Longitud</label>
                            <input type="number" step="any" value={stopLng} onChange={e => setStopLng(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text focus:ring-2 focus:ring-secondary outline-none" placeholder="-66.9036" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-text">Imagen URL (Opcional)</label>
                        <input value={stopImg} onChange={e => setStopImg(e.target.value)} placeholder="https://..." className="w-full p-2 border border-border rounded-lg bg-background text-text" />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-secondary-dark transition-colors">
                        {loading ? 'Guardando...' : (stopFormMode === 'edit' ? 'Actualizar Parada' : 'Agregar Parada')}
                    </button>
                </form>
            </div>

            {/* TOURIST STOPS LIST */}
            {selectedDestino && touristStops.length > 0 && (
                <div className="bg-surface border border-border rounded-xl p-4 sm:p-8 shadow-sm ring-1 ring-black/5">
                    <h2 className="text-xl font-bold mb-6 text-text flex items-center gap-2">
                        <Icon icon="lucide:map-pin" />
                        Paradas del Destino Seleccionado
                    </h2>
                    <div className="space-y-3">
                        {touristStops.map(stop => (
                            <div key={stop.id} className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-secondary/30 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-text truncate">{stop.nombre}</h3>
                                    <p className="text-sm text-text-muted">{stop.tipo} • Orden: {stop.orden}</p>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <button
                                        onClick={() => handleEditStop(stop)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Icon icon="lucide:pencil" className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteStop(stop.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Icon icon="lucide:trash-2" className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {feedback && (
                <div className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 ${feedback.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {feedback.msg}
                </div>
            )}
        </div>
    );
};
