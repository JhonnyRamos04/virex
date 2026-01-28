import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface PointOfInterest {
    id: string;
    location: [number, number];
    title: string;
    description: string;
    type: string;
    image: string;
}

interface MapRoute {
    id: string;
    points: [number, number][];
    color: string;
    name: string;
}

interface MapProps {
    lat?: number;
    lng?: number;
    zoom?: number;
    markerTitle?: string;
    className?: string;
    routes?: MapRoute[];
    pointsOfInterest?: PointOfInterest[];
}

export const Map: React.FC<MapProps> = ({
    lat = 10.2469,
    lng = -67.5958,
    zoom = 15,
    markerTitle = 'Nuestra Oficina',
    className = 'h-[400px] w-full rounded-xl shadow-md border border-border',
    routes = [],
    pointsOfInterest = []
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current || mapInstance.current) return;

        const initMap = async () => {
            // Dynamic import Leaflet
            const L = (await import('leaflet')).default;

            if (!mapRef.current || mapInstance.current) return;

            // Fix for default marker icons in Leaflet when using build tools
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Initialize map
            mapInstance.current = L.map(mapRef.current).setView([lat, lng], zoom);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(mapInstance.current);

            // Add main marker
            L.marker([lat, lng])
                .addTo(mapInstance.current)
                .bindPopup(markerTitle)
                .openPopup();

            // Render Routes
            routes.forEach((route: MapRoute) => {
                L.polyline(route.points, { color: route.color, weight: 4 }).addTo(mapInstance.current).bindPopup(route.name);
            });

            // Render POIs
            pointsOfInterest.forEach((poi: PointOfInterest) => {
                const popupContent = `
          <div class="min-w-[200px]">
            <img src="${poi.image}" alt="${poi.title}" class="w-full h-32 object-cover rounded-md mb-2" />
            <h3 class="font-bold text-lg">${poi.title}</h3>
            <p class="text-sm text-gray-600">${poi.description}</p>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block capitalize">${poi.type}</span>
          </div>
        `;

                L.marker(poi.location)
                    .addTo(mapInstance.current)
                    .bindPopup(popupContent);
            });

            // Fit bounds if there are multiple points
            if (pointsOfInterest.length > 0) {
                const bounds = L.latLngBounds([[lat, lng], ...pointsOfInterest.map((p: PointOfInterest) => p.location)]);
                mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
            }
        };

        initMap();

        // Cleanup function
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [lat, lng, zoom, markerTitle, routes, pointsOfInterest]);

    return (
        <div className="relative w-full">
            <div
                ref={mapRef}
                className={className}
                style={{ zIndex: 1 }}
            />
        </div>
    );
};

export default Map;
