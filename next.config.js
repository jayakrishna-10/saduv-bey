/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental flag
  reactStrictMode: true,
  swcMinify: true,
  // Add output configuration
  output: 'standalone',
}

module.exports = nextConfig
