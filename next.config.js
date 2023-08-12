/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'userprofile.habitify.me',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig
