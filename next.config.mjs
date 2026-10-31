/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/daraja', destination: '/daraja/index.html' },
        { source: '/daraja/:path*/', destination: '/daraja/:path*/index.html' },
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
