import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'barili.shop',
        pathname: '/media/**', // 👈 allow all under /media/
      },
    ],
  },
};

export default nextConfig;
