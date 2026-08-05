import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Lora, Poppins } from 'next/font/google'
import { Suspense } from 'react'
import { CartProvider } from '@/components/cart/cart-provider'
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
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
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
        <Suspense fallback={null}>
          <CartProvider>{children}</CartProvider>
        </Suspense>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
