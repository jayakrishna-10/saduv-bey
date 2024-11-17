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
      canvas: false,
    };
    
    // Remove the null-loader rule for mermaid
    config.module.rules = config.module.rules.filter(rule => {
      if (rule.test?.toString().includes('mermaid')) {
        return false;
      }
      return true;
    });

    return config;
  },
  // Add transpilePackages for mermaid
  transpilePackages: ['mermaid']
}

module.exports = nextConfig
