import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost:9090',
      },
      {
        protocol: 'https',
        hostname: 'nhlllpowibmoynupqjel.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      }
    ]
  }
};

export default nextConfig;
