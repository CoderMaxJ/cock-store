import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '72.61.119.209',
        port: '8000', // ADD THIS IF BACKEND USES 8000
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;

