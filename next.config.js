/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
      {
        source: '/query-lab',
        destination: '/analysis',
        permanent: true,
      },
      {
        source: '/query-lab/history',
        destination: '/analysis',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
