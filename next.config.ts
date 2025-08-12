import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  // Ensure proper handling of environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  }
};

export default nextConfig;
