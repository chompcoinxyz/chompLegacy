/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['smmagent.s3.amazonaws.com'],
  },
}

module.exports = nextConfig
