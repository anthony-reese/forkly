import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-media*.fl.foursquarecdn.com',
      },
      {
        protocol: 'https',
        hostname: 'ss3.4sqi.net',
      },
    ],
  },
};

export default nextConfig;
