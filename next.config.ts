import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your other Next.js configurations...

  // === START: Turbopack configuration for 'next dev --turbopack' ===
  experimental: {
    turbo: {
      resolveAlias: {
        // Add the new modules to be ignored for the client bundle.
        tls: "false",
        // net: "false",
        child_process: "false", // <-- ADD THIS LINE
        // fs: "false",           // <-- ADD THIS LINE (from the error stack)
        // os: "false",           // <-- ADD THIS LINE (from the error stack)
      },
    },
  },
  // === END: Turbopack configuration ===

  // === START: Webpack configuration for 'next build' ===
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Add the new modules to be ignored for the client bundle.
        tls: false,
        // net: false,
        child_process: false, // <-- ADD THIS LINE
        // fs: false,           // <-- ADD THIS LINE
        // os: false,           // <-- ADD THIS LINE
      };
      
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // === END: Webpack configuration ===
};

export default nextConfig;