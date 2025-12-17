import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '54.66.240.196',
        port: '8000', // ADD THIS IF BACKEND USES 8000
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;

