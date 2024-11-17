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
    
    // Remove any existing mermaid-related rules
    config.module.rules = config.module.rules.filter(rule => {
      if (rule.test?.toString().includes('mermaid')) {
        return false;
      }
      return true;
    });

    return config;
  },
  // Enable better module support
  experimental: {
    esmExternals: 'loose',
  },
  // Ensure mermaid is transpiled
  transpilePackages: ['mermaid']
}

module.exports = nextConfig
