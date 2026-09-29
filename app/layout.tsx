import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Lora, Poppins } from 'next/font/google'
import Script from 'next/script'
import { Suspense } from 'react'
import { CartProvider } from '@/components/cart/cart-provider'
import { siteUrl } from '@/lib/seo'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kimobo Furnitures — Considered Furniture for Modern Living',
    template: '%s — Kimobo Furnitures',
  },
  description:
    'Kimobo Furnitures crafts warm, minimalist furniture in solid oak and walnut for the living room, dining room, office, and bedroom. Free delivery and lifetime craftsmanship.',
  keywords: [
    'furniture',
    'oak furniture',
    'minimalist furniture',
    'sofas',
    'dining tables',
    'desks',
    'beds',
  ],
  applicationName: 'Kimobo Furnitures',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: '/',
    siteName: 'Kimobo Furnitures',
    title: 'Kimobo Furnitures — Considered Furniture for Modern Living',
    description:
      'Shop thoughtfully designed furniture in Kenya, including sofas, dining tables, desks, and beds made for everyday living.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kimobo Furnitures — Considered Furniture for Modern Living',
    description:
      'Shop thoughtfully designed furniture in Kenya, made for everyday living.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'v21yUSqcS8IftDdjDE8xXH0Kc6BGA3yKSYqMIyfCSsA',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.jpg', type: 'image/jpg' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f2ede3',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable} bg-background`}>
      <body className="font-sans antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T6KMKKTJ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T6KMKKTJ');`}
        </Script>
        <Suspense fallback={null}>
          <CartProvider>{children}</CartProvider>
        </Suspense>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
