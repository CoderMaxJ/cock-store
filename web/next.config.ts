import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000', // 👈 your Django port
        pathname: '/media/**', // 👈 allow all under /media/
      },
    ],
  },
};

export default nextConfig;
