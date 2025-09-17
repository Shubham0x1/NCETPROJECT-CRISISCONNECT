/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // <-- ADDED THIS LINE

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // This rewrites configuration will proxy API requests from your frontend
  // to your backend server, solving the CORS issue.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },
};

export default nextConfig;