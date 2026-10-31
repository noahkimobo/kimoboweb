/**
 * Single source of truth for site-wide facts. Anything that varies per
 * deployment comes from PUBLIC_* environment variables (see .env.example).
 */

const env = import.meta.env;

/** Digits only, 10 to 15 long (international format, no "+"). */
const PHONE_PATTERN = /^\d{10,15}$/;
const EMAIL_PATTERN = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;

function readPhone(value: unknown): string | null {
  return typeof value === 'string' && PHONE_PATTERN.test(value) ? value : null;
}

function readEmail(value: unknown): string | null {
  return typeof value === 'string' && EMAIL_PATTERN.test(value) ? value : null;
}

function readHttpsUrl(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.hostname === 'localhost' ? url.origin : fallback;
  } catch {
    return fallback;
  }
}

export const SITE = {
  name: 'Daraja',
  legalLocale: 'en_KE',
  language: 'en',
  city: 'Nairobi',
  country: 'Kenya',
  tagline: 'Online migration and social media growth for businesses in Nairobi',
  url: readHttpsUrl(env.PUBLIC_SITE_URL, 'https://kimobofurnitures.com'),
  appUrl: readHttpsUrl(env.PUBLIC_APP_URL, 'https://app.daraja.co.ke'),
} as const;

const whatsappNumber = readPhone(env.PUBLIC_WHATSAPP_NUMBER);
const contactEmail = readEmail(env.PUBLIC_CONTACT_EMAIL);

if (import.meta.env.PROD && !whatsappNumber && !contactEmail) {
  console.warn(
    '[daraja] PUBLIC_WHATSAPP_NUMBER and PUBLIC_CONTACT_EMAIL are not set. ' +
      'The Contact page will show no contact details until you add them.',
  );
}

export const CONTACT = {
  whatsappNumber,
  email: contactEmail,
  /** Pre-filled message only; never interpolate user input into this URL. */
  whatsappUrl: whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hello Daraja, I would like to talk about my business.',
      )}`
    : null,
  emailUrl: contactEmail ? `mailto:${contactEmail}` : null,
} as const;

export const NAV = [
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
  { label: 'FAQ', href: '/faq/' },
] as const;

export const CTA_LABEL = 'Start a conversation';
