import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['impxdev.ddns.net'],
  cacheComponents: false,
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
