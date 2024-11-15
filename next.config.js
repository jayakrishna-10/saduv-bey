// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Remove standalone output as it's not needed for Vercel
  // Remove experimental.appDir as it's no longer needed in Next.js 14
}

module.exports = nextConfig
