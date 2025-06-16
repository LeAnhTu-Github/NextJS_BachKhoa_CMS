import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '103.147.34.20',
        port: '19800',
        pathname: '/api/file/content/**',
      },
    ],
  },
};

export default nextConfig;
