/**
 * Contact Page Configuration
 *
 * @description
 * Contact information, methods, and FAQ data for the contact page.
 * Modify these values to customize your contact page content.
 */

import type { ContactInfo, ContactMethod, ContactFAQ } from '../lib/types';

/** Contact information used across contact page and legal pages */
export const contact: ContactInfo = {
  email: 'hola@goflowtrips.com',
  supportEmail: 'soporte@goflowtrips.com',
  salesEmail: 'ventas@goflowtrips.com',
  address: {
    street: 'Av constitucion',
    city: 'Maracay',
    state: 'Aragua',
    zip: '2101',
    country: 'Venezuela',
  },
};

/** Contact methods displayed on the contact page */
export const contactMethods: ContactMethod[] = [
  {
    icon: 'lucide:mail',
    label: 'Email',
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
  {
    icon: 'simple-icons:discord',
    label: 'Discord',
    value: 'Únete a Discord',
    href: 'https://discord.gg/goflowtrips',
  },
  {
    icon: 'lucide:twitter',
    label: 'Twitter',
    value: '@goflowtrips',
    href: 'https://twitter.com/goflowtrips',
  },
];

/** FAQ items displayed on the contact page */
export const contactFAQs: ContactFAQ[] = [
  {
    question: '¿Cuál es tu tiempo de respuesta típico?',
    answer: 'Respondemos a la mayoría de las consultas dentro de 24 horas durante los días laborables.',
  },
  {
    question: '¿Ofrecen soporte telefónico?',
    answer:
      'El soporte telefónico está disponible para clientes Empresariales. Los demás pueden contactarnos por email o Discord.',
  },
  {
    question: '¿Cómo reporto un problema técnico?',
    answer: 'Usa el formulario con "Soporte técnico" como asunto, o abre un issue en nuestro GitHub.',
  },
];
