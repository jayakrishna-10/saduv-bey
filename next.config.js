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
    
    return config;
  },
  transpilePackages: ['markmap-lib', 'markmap-view', 'markmap-common'],
  experimental: {
    esmExternals: 'loose',
  }
}

module.exports = nextConfig
