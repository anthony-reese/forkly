import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-media*.fl.yelpcdn.com',
      },
    ],
  },
};

export default nextConfig;
