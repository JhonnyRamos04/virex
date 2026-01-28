/**
 * Navigation Configuration
 *
 * @description
 * Centralized navigation configuration for header and footer.
 * All navigation items are defined here for consistency and easy maintenance.
 *
 * Items with a `feature` property will only be shown if that feature is enabled
 * in the site config's feature flags.
 */

import type { Navigation } from '../lib/types';

export const navigation: Navigation = {
  /**
   * Header Navigation
   * - main: Primary navigation links
   * - cta: Call-to-action buttons on the right
   */
  header: {
    main: [
      { label: 'Funcionalidades', href: '/features' },
      { label: 'Precios', href: '/pricing' },
      { label: 'Demo', href: '/dashboard' },
      { label: 'Clientes', href: '/customers' },
      { label: 'Empresas', href: '/enterprise' },
      { label: 'Documentación', href: '/docs', feature: 'docs' },
      { label: 'Blog', href: '/blog', feature: 'blog' },
    ],
    cta: [
      { label: 'Iniciar Sesión', href: '/login', variant: 'ghost' },
      { label: 'Empezar', href: '/register', variant: 'primary' },
    ],
  },

  /**
   * Footer Navigation
   * Organized into 5 columns: Product, Solutions, Resources, Company, Legal
   */
  footer: {
    product: [
      { label: 'Destinos Populares', href: '/destinos' },
      { label: 'Ofertas Especiales', href: '/ofertas' },
      { label: 'Seguro de Viaje', href: '/seguro' },
      { label: 'Precios', href: '/precios' },
      { label: 'Preguntas Frecuentes', href: '/faq' },
    ],
    solutions: [
      { label: 'Viajes Corporativos', href: '/empresas' },
      { label: 'Grupos', href: '/grupos' },
      { label: 'Luna de Miel', href: '/luna-de-miel' },
      { label: 'Aventura', href: '/aventura' },
    ],
    resources: [
      { label: 'Guía de Viaje', href: '/guia', feature: 'docs' },
      { label: 'Blog de Viajes', href: '/blog', feature: 'blog' },
      { label: 'Novedades', href: '/novedades', feature: 'changelog' },
      { label: 'Mapa de Sitio', href: '/mapa', feature: 'roadmap' },
    ],
    company: [
      { label: 'Sobre Nosotros', href: '/about' },
      { label: 'Carreras', href: '/careers' },
      { label: 'Contacto', href: '/contact' },
      { label: 'Testimonios', href: '/testimonios', feature: 'testimonials' },
    ],
    legal: [
      { label: 'Privacidad', href: '/privacy' },
      { label: 'Términos', href: '/terms' },
    ],
  },
};
