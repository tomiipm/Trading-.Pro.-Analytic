/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  },
  images: {
    // Note: unoptimized: true is set for compatibility with some hosting providers
    // that don't support Next.js Image Optimization API
    // For production on Vercel/Netlify, consider setting to false for better performance
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trading-pro-analytic.com',
      },
    ],
  },
}

export default nextConfig
