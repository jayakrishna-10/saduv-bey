// File: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Existing fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      canvas: false,
    };
    
    // Add specific rule for handling mermaid
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /mermaid/,
          use: {
            loader: 'null-loader',
          },
        },
      ],
    };

    return config;
  },
  // Add experimental features for better module support
  experimental: {
    esmExternals: 'loose', // This might help with mermaid imports
  },
  // Ensure mermaid is transpiled
  transpilePackages: ['mermaid']
}

module.exports = nextConfig
