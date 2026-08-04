export const siteConfig = {
  name: 'Kimobo Furnitures',
  tagline: 'Considered furniture for modern living',
  // WhatsApp business number in international format (no + or spaces)
  // Local number 0141459677 -> Kenyan country code 254 replaces the leading 0
  whatsappNumber: '254141459677',
  whatsappGreeting:
    "Hi Kimobo Furnitures, I have a question about your furniture and I'd love some help.",
  email: 'hello@kimobofurnitures.com',
  phone: '+254 141 459 677',
  // Update these with your real profile/page URLs. Leave as '' to hide an icon.
  social: {
    facebook: 'https://facebook.com/kimobofurnitures',
    instagram: 'https://instagram.com/kimobofurnitures',
    tiktok: 'https://tiktok.com/@kimobofurnitures',
    twitter: '',
  },
}

export function whatsappLink(message?: string): string {
  const text = encodeURIComponent(message ?? siteConfig.whatsappGreeting)
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`
}
