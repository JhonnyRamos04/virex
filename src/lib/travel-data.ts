/**
 * Travel Dashboard Data
 *
 * @description
 * Provides sample data for travel-oriented dashboard.
 * This data is fictional and should be replaced with real API calls.
 */

import type { MapRoute, PointOfInterest } from './types';

export interface TravelEvent {
  id: string;
  title: string;
  date: Date;
  type: 'booking' | 'trip' | 'reminder';
  destination?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
  price?: number;
  guests?: number;
  description?: string;
  location?: string;
}

export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  available: boolean;
  nextAvailable?: Date;
}

export interface TravelMetric {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon: string;
  description: string;
}

/**
 * Get sample travel events for calendar
 */
export function getTravelEvents(): TravelEvent[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return [
    {
      id: '1',
      title: 'Viaje a Cancún',
      date: new Date(currentYear, currentMonth, 5),
      type: 'trip',
      destination: 'Cancún, México',
      status: 'confirmed',
      guests: 2,
      description: 'Viaje de relajación en resort todo incluido.',
      location: 'Hotel Riu Palace'
    },
    {
      id: '2',
      title: 'Reserva Hotel París',
      date: new Date(currentYear, currentMonth, 12),
      type: 'booking',
      destination: 'París, Francia',
      status: 'confirmed',
      price: 250,
      guests: 2
    },
    {
      id: '3',
      title: 'Vuelo a Nueva York',
      date: new Date(currentYear, currentMonth, 18),
      type: 'booking',
      destination: 'Nueva York, EE.UU.',
      status: 'pending',
      price: 450,
      guests: 1
    },
    {
      id: '4',
      title: 'Check-in Online',
      date: new Date(currentYear, currentMonth, 22),
      type: 'reminder',
      destination: 'Tokio, Japón',
      status: 'confirmed'
    },
    {
      id: '5',
      title: 'Tour por Europa',
      date: new Date(currentYear, currentMonth, 28),
      type: 'trip',
      destination: 'Roma, Italia',
      status: 'confirmed',
      guests: 4
    }
  ];
}

/**
 * Get upcoming trips
 */
export function getUpcomingTrips(): TravelEvent[] {
  const events = getTravelEvents();
  const now = new Date();

  return events
    .filter(event => event.date >= now && event.type === 'trip')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);
}

/**
 * Get pending bookings
 */
export function getPendingBookings(): TravelEvent[] {
  const events = getTravelEvents();
  const now = new Date();

  return events
    .filter(event => event.status === 'pending' && event.type === 'booking')
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get popular destinations from backend API
 */
export async function getPopularDestinations(): Promise<TravelDestination[]> {
  try {
    const response = await fetch('http://localhost:8000/api/destinos/');
    
    if (response.ok) {
      const backendDestinations = await response.json();
      
      // Transform backend data to TravelDestination format
      return backendDestinations.map((dest: any) => ({
        id: dest.id.toString(),
        name: dest.titulo,
        country: extractCountryFromTitle(dest.titulo),
        image: dest.imagen_url,
        price: dest.precio,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        available: dest.disponible
      }));
    } else {
      throw new Error('Failed to fetch destinations');
    }
  } catch (error) {
    console.error('Error fetching destinations from backend:', error);
    
    // Fallback to mock data if backend is not available
    return [
      {
        id: '1',
        name: 'Cancún',
        country: 'México',
        image: '/images/destinations/cancun.jpg',
        price: 899,
        rating: 4.8,
        available: true
      },
      {
        id: '2',
        name: 'París',
        country: 'Francia',
        image: '/images/destinations/paris.jpg',
        price: 1299,
        rating: 4.9,
        available: true
      },
      {
        id: '3',
        name: 'Nueva York',
        country: 'EE.UU.',
        image: '/images/destinations/nyc.jpg',
        price: 1599,
        rating: 4.7,
        available: false,
        nextAvailable: new Date('2024-02-15')
      },
      {
        id: '4',
        name: 'Tokio',
        country: 'Japón',
        image: '/images/destinations/tokyo.jpg',
        price: 1899,
        rating: 4.9,
        available: true
      },
      {
        id: '5',
        name: 'Roma',
        country: 'Italia',
        image: '/images/destinations/rome.jpg',
        price: 1199,
        rating: 4.6,
        available: true
      }
    ];
  }
}

/**
 * Extract country from destination title
 */
function extractCountryFromTitle(title: string): string {
  // Common patterns in destination titles
  if (title.includes('Francia')) return 'Francia';
  if (title.includes('Japón')) return 'Japón';
  if (title.includes('USA') || title.includes('Estados Unidos')) return 'EE.UU.';
  if (title.includes('Italia')) return 'Italia';
  if (title.includes('México')) return 'México';
  if (title.includes('España')) return 'España';
  if (title.includes('Reino Unido')) return 'Reino Unido';
  if (title.includes('Alemania')) return 'Alemania';
  
  // Default extraction from title format "City, Country"
  const parts = title.split(',');
  return parts.length > 1 ? parts[1].trim() : 'Desconocido';
}

/**
 * Get travel dashboard metrics
 */
export function getTravelMetrics(): TravelMetric[] {
  return [
    {
      title: 'Viajes este Mes',
      value: 8,
      trend: {
        value: 12,
        direction: 'up',
      },
      icon: 'plane',
      description: 'Viajes programados y completados',
    },
    {
      title: 'Reservas Pendientes',
      value: 3,
      trend: {
        value: 8,
        direction: 'down',
      },
      icon: 'clock',
      description: 'Esperando confirmación',
    },
    {
      title: 'Destinos Visitados',
      value: 24,
      trend: {
        value: 15,
        direction: 'up',
      },
      icon: 'map-pin',
      description: 'Total de destinos explorados',
    },
    {
      title: 'Ahorro Total',
      value: '$2,450',
      trend: {
        value: 5,
        direction: 'up',
      },
      icon: 'dollar-sign',
      description: 'Acumulado en reservas',
    },
  ];
}

/**
 * Get Points of Interest for Map
 */
export function getPointsOfInterest(): PointOfInterest[] {
  return [
    {
      id: '1',
      location: [10.2469, -67.5958],
      title: 'Oficina Central',
      description: 'Nuestra sede principal en Maracay.',
      type: 'monument', // Using monument icon for office for now
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '2',
      location: [10.2500, -67.6000],
      title: 'Hotel Maracay',
      description: 'El hotel más lujoso de la ciudad con vista al parque.',
      type: 'hotel',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '3',
      location: [10.2400, -67.5900],
      title: 'Restaurante El Fogón',
      description: 'La mejor comida criolla de la región.',
      type: 'restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '4',
      location: [10.2550, -67.5850],
      title: 'Plaza Bolívar',
      description: 'Lugar histórico y punto de encuentro.',
      type: 'monument',
      image: 'https://images.unsplash.com/photo-1569420847775-60c727a876a4?auto=format&fit=crop&w=400&q=80',
    }
  ];
}

/**
 * Get Map Routes
 */
export function getMapRoutes(): MapRoute[] {
  return [
    {
      id: 'route-1',
      name: 'Ruta Turística Centro',
      color: '#3b82f6', // blue-500
      points: [
        [10.2469, -67.5958], // Office
        [10.2500, -67.6000], // Hotel
        [10.2550, -67.5850], // Plaza
        [10.2400, -67.5900], // Restaurant
        [10.2469, -67.5958], // Back to Office
      ]
    }
  ];
}

export interface PaymentHistory {
  id: string;
  date: Date;
  amount: number;
  method: string;
  status: 'confirmed' | 'pending' | 'failed';
  reference: string;
  description: string;
}

/**
 * Get Payment History
 */
export function getPaymentHistory(): PaymentHistory[] {
  return [
    {
      id: 'pay-1',
      date: new Date('2023-11-15'),
      amount: 250,
      method: 'Zelle',
      status: 'confirmed',
      reference: 'USER-123456',
      description: 'Reserva Hotel París (50%)'
    },
    {
      id: 'pay-2',
      date: new Date('2023-12-01'),
      amount: 450,
      method: 'Pago Móvil',
      status: 'confirmed',
      reference: '12345678',
      description: 'Vuelo a Nueva York'
    },
    {
      id: 'pay-3',
      date: new Date(),
      amount: 150,
      method: 'PayPal',
      status: 'pending',
      reference: 'PP-987654321',
      description: 'Tour por Roma'
    }
  ];
}
