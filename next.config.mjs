/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // The old Vercel address sends visitors and Google to the real domain, page for page,
  // so its Google ranking carries over. Previews use other *.vercel.app addresses and are not affected.
  // The Google verification file stays reachable so the old Search Console property remains verified.
  async redirects() {
    return [
      {
        source: '/:path((?!googlee8790c98077991ea\\.html$).*)',
        has: [{ type: 'host', value: 'planete-auto.vercel.app' }],
        destination: 'https://www.planeteauto34.fr/:path',
        permanent: true,
      },
    ]
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
}

export default nextConfig
