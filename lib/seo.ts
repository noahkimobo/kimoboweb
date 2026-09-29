const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  'https://kimobofurnitures.com'

export const siteUrl = new URL(
  configuredSiteUrl.startsWith('http') ? configuredSiteUrl : `https://${configuredSiteUrl}`,
).origin