// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['vercel.com'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      canvas: false,
    };
    
    // Handle Mermaid ESM issues
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'cytoscape': require.resolve('cytoscape'),
      };
    }
    
    // Externalize problematic modules for server builds
    if (isServer) {
      config.externals = [...(config.externals || []), 'cytoscape', 'cytoscape-cose-bilkent', 'cytoscape-fcose'];
    }
    
    return config;
  },
  transpilePackages: ['mermaid'],
  experimental: {
    esmExternals: 'loose',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
