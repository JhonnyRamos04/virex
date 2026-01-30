/**
 * Dashboard Navigation Configuration
 *
 * @description
 * Defines the sidebar navigation structure for dashboard pages.
 * Supports nested navigation (up to 2 levels) and section headers.
 */

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string; // Lucide icon name
  children?: DashboardNavItem[];
}

export interface DashboardNavSection {
  title?: string; // Optional section header
  items: DashboardNavItem[];
}

export const dashboardNavigation: DashboardNavSection[] = [
  {
    items: [
      {
        label: 'Vista General',
        href: '/dashboard',
        icon: 'layout-dashboard',
      },
    ],
  },
  {
    title: 'Gestión',
    items: [
      {
        label: 'Calendario',
        href: '/dashboard/calendar',
        icon: 'calendar',
      },
      {
        label: 'Mi Destino',
        href: '/dashboard/my-destination',
        icon: 'map-pin',
      },
      {
        label: 'Mapa Turístico',
        href: '/dashboard/tourist-map',
        icon: 'map',
      },
      {
        label: 'Comunidad',
        href: '/dashboard/community',
        icon: 'users',
      },
      {
        label: 'Pagos',
        href: '/dashboard/payments',
        icon: 'credit-card',
      },
      {
        label: 'Destinos',
        href: '/dashboard/destinations',
        icon: 'globe',
      },
    ],
  },
  {
    title: 'Configuraciones',
    items: [
      {
        label: 'Configuraciones',
        href: '/dashboard/settings',
        icon: 'settings',
        children: [
          {
            label: 'Perfil',
            href: '/dashboard/settings/profile',
            icon: 'user',
          },

        ],
      },
    ],
  },
];
