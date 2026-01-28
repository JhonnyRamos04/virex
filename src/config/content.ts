/**
 * Content Strings Configuration
 *
 * @description
 * Configurable text content for various site sections.
 * Modify these to customize messaging without touching component code.
 */

import type { AnnouncementConfig, ContentStrings } from '../lib/types';

/** Announcement bar configuration */
export const announcement: AnnouncementConfig = {
  /** Show/hide the announcement bar */
  enabled: true,

  /** Unique ID - change this to reset dismissal for new announcements */
  id: 'launch-2025',

  /** Announcement text */
  text: '🌍 GoFlowTrips está aquí!',

  /** Optional link URL */
  href: '/destinos',

  /** Optional link text */
  linkText: 'Descubre nuevos destinos',

  /** Visual style: 'primary' | 'secondary' | 'gradient' */
  variant: 'primary',

  /** Allow users to dismiss the announcement */
  dismissible: true,
};

/** Configurable content strings for various sections */
export const content: ContentStrings = {
  newsletter: {
    title: 'Mantente informado',
    description: 'Recibe las últimas actualizaciones, consejos y noticias de viajes en tu correo.',
    placeholder: 'Ingresa tu correo electrónico',
    buttonText: 'Suscribirse',
    successMessage: '¡Gracias por suscribirte! Revisa tu correo para confirmar.',
    errorMessage: 'Algo salió mal. Por favor intenta de nuevo.',
    privacyNote: 'Respetamos tu privacidad. Puedes cancelar la suscripción en cualquier momento.',
  },
};
