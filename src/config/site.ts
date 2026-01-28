/**
 * Site Configuration
 *
 * @description
 * Core site metadata and branding settings.
 * These values can be customized via environment variables or by editing the defaults below.
 */

import type { SocialLinks, LegalConfig } from '../lib/types';

/** Site name displayed in header, footer, and meta tags */
export const name = import.meta.env.SITE_NAME || 'GoFlowTrips';

/** Site description for SEO and meta tags */
export const description =
  import.meta.env.SITE_DESCRIPTION || 'Tu plataforma de confianza para descubrir y reservar los mejores destinos de viaje';

/** Production URL of your site (used for sitemap, RSS, canonical URLs) */
export const url = import.meta.env.SITE_URL || 'http://localhost:4321';

/** Author name for meta tags and copyright */
export const author = import.meta.env.SITE_AUTHOR || 'GoFlowTrips Team';

/** Path to logo file (relative to /public) */
export const logo = '/logo.svg';

/** Path to Open Graph image (relative to /public) */
export const ogImage = '/images/og-image.png';

/** Social media links */
export const social: SocialLinks = {
  twitter: 'https://twitter.com/goflowtrips',
  github: 'https://github.com/goflowtrips',
  discord: 'https://discord.gg/goflowtrips',
};

/** Legal configuration for privacy policy and terms pages */
export const legal: LegalConfig = {
  privacyEmail: 'privacidad@goflowtrips.com',
  legalEmail: 'legal@goflowtrips.com',
  lastUpdated: '14 de enero de 2026',
};
