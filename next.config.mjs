/** @type {import('next').NextConfig} */
const darajaRoutes = ['about', 'contact', 'faq', 'services', 'work']

const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/daraja', destination: '/daraja/index.html' },
        ...darajaRoutes.map((route) => ({
          source: `/daraja/${route}`,
          destination: `/daraja/${route}/index.html`,
        })),
        {
          source: '/daraja/services/:slug',
          destination: '/daraja/services/:slug/index.html',
        },
      ],
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
