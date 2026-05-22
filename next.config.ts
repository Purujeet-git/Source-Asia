import withPWA
from 'next-pwa'

const runtimeCaching = [

  {
    urlPattern:
      /^https:\/\/.*\/rest\/v1\/flights/,

    handler:
      'StaleWhileRevalidate',

    options: {

      cacheName:
        'flight-search-cache',
    },
  },

  {
    urlPattern:
      /\.(?:js|css|png|jpg|svg)$/,

    handler:
      'CacheFirst',

    options: {

      cacheName:
        'static-assets',
    },
  },
]

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching,
})(nextConfig)