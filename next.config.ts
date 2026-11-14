import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['impxdev.ddns.net', '192.168.0.191', 'localhost', '127.0.0.1'],
  cacheComponents: false,
  experimental: {
    agentUpgrade: 'security',
  },
  partialPrefetching: false,
  output: 'standalone',
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
