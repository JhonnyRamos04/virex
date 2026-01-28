import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export const AdminDestinationManager: React.FC = () => {
    // Ideally fetch existing destinations here to edit them
    // For now, implementing "Create New" form

    const [loading, setLoading] = useState(false);

    // Form States
    const [titulo, setTitulo] = useState('');
    const [desc, setDesc] = useState('');
    const [precio, setPrecio] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    // Tourist Stop States
    const [destinations, setDestinations] = useState<any[]>([]);
    const [selectedDestino, setSelectedDestino] = useState('');
    const [stopName, setStopName] = useState('');
    const [stopDesc, setStopDesc] = useState('');
    const [stopLat, setStopLat] = useState('');
    const [stopLng, setStopLng] = useState('');
    const [stopImg, setStopImg] = useState('');
    const [desLat, setDesLat] = useState('');
    const [desLng, setDesLng] = useState('');

    React.useEffect(() => {
        const token = localStorage.getItem('authToken');
        // Fetch destinations for dropdown
        fetch('http://localhost:8000/api/destinos/', {
            headers: { 'Authorization': `Token ${token}` }
        })
            .then(res => res.json())
            .then(data => setDestinations(data))
            .catch(err => console.error("Error loading destinations", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        const token = localStorage.getItem('authToken');

        try {
            const res = await fetch('http://localhost:8000/api/destinos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    titulo,
                    descripcion: desc,
                    precio: parseFloat(precio),
                    imagen_url: imgUrl,
                    disponible: true,
                    latitud: parseFloat(desLat),
                    longitud: parseFloat(desLng),
                })
            });

            if (res.ok) {
                setFeedback({ msg: 'Destino creado con éxito', type: 'success' });
                // Reset form
                setTitulo(''); setDesc(''); setPrecio(''); setImgUrl('');
                // Refresh destinations list for the dropdown
                fetch('http://localhost:8000/api/destinos/', {
                    headers: { 'Authorization': `Token ${token}` }
                })
                    .then(res => res.json())
                    .then(data => setDestinations(data));
            } else {
                setFeedback({ msg: 'Error al crear destino', type: 'error' });
            }
        } catch (e) {
            setFeedback({ msg: 'Error de conexión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleStopSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        const token = localStorage.getItem('authToken');

        try {
            const res = await fetch('http://localhost:8000/api/paradas/', {
                method: 'POST',
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
                    tipo: 'otro', // Default type
                    orden: 0
                })
            });

            if (res.ok) {
                setFeedback({ msg: 'Parada turística agregada con éxito', type: 'success' });
                // Reset form
                setStopName(''); setStopDesc(''); setStopLat(''); setStopLng(''); setStopImg('');
            } else {
                setFeedback({ msg: 'Error al agregar parada', type: 'error' });
            }
        } catch (e) {
            setFeedback({ msg: 'Error de conexión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-text flex items-center gap-2">
                    <Icon icon="lucide:map-pin" /> Agregar Nuevo Destino
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text">Título</label>
                        <input value={titulo} onChange={e => setTitulo(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text">Descripción</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Precio ($)</label>
                            <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Imagen URL</label>
                            <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} required placeholder="https://..." className="w-full p-2 border border-border rounded-lg bg-background text-text" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Latitud</label>
                            <input type="number" step="any" value={desLat} onChange={e => setDesLat(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" placeholder="10.4806" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Longitud</label>
                            <input type="number" step="any" value={desLng} onChange={e => setDesLng(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" placeholder="-66.9036" />
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors">
                        {loading ? 'Guardando...' : 'Crear Destino'}
                    </button>
                </form>
            </div>

            {/* TOURIST STOP CREATION FORM */}
            <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-text flex items-center gap-2">
                    <Icon icon="lucide:map" /> Agregar Parada Turística
                </h2>

                <form onSubmit={handleStopSubmit} className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Latitud</label>
                            <input type="number" step="any" value={stopLat} onChange={e => setStopLat(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" placeholder="10.4806" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text">Longitud</label>
                            <input type="number" step="any" value={stopLng} onChange={e => setStopLng(e.target.value)} required className="w-full p-2 border border-border rounded-lg bg-background text-text" placeholder="-66.9036" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-text">Imagen URL (Opcional)</label>
                        <input value={stopImg} onChange={e => setStopImg(e.target.value)} placeholder="https://..." className="w-full p-2 border border-border rounded-lg bg-background text-text" />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-secondary-dark transition-colors">
                        {loading ? 'Guardando...' : 'Agregar Parada'}
                    </button>
                </form>
            </div>

            {feedback && (
                <div className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 ${feedback.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {feedback.msg}
                </div>
            )}
        </div>
    );
};
