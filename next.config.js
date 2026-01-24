/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle Three.js
    config.externals = config.externals || []
    if (!isServer) {
      config.externals.push({
        canvas: 'canvas',
      })
    }
    
    return config
  },
}

module.exports = nextConfig