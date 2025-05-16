/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['github.com', 'lh3.googleusercontent.com'],
  },
  output: 'standalone',
  distDir: '.next',
}

module.exports = nextConfig 