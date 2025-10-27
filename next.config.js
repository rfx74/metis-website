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
    domains: ['images.unsplash.com', 'via.placeholder.com'],
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