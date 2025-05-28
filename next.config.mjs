/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optimizes for production deployment
  poweredByHeader: false, // Removes the X-Powered-By header for security
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    // Add any other domains you need for images
    unoptimized: true,
  },
  // Increase the body parser size limit for API routes
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  serverExternalPackages: ['openai'],
}

export default nextConfig
