/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['smmagent.s3.amazonaws.com', 'tan-hilarious-chickadee-235.mypinata.cloud', 'tan-hollow-bear-481.mypinata.cloud'],
  },
}

module.exports = nextConfig
