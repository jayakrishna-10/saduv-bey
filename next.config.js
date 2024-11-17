// File: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      canvas: false,  // Add this for mermaid
    };
    
    // Add additional module rules for mermaid
    config.module = {
      ...config.module,
      exprContextCritical: false,  // Suppress warnings from mermaid
      rules: [
        ...config.module.rules,
        {
          test: /mermaid/,
          use: {
            loader: 'null-loader'
          }
        }
      ]
    };
    
    return config;
  },
  // Add transpilePackages for mermaid
  transpilePackages: ['mermaid']
}

module.exports = nextConfig
