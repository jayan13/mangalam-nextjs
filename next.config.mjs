const nextConfig = {
  allowedDevOrigins: ['dev.mangalam.com', 'mangalam.com', 'images.mangalam.com', 'mangalam.cms'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.mangalam.com',
      },
      {
        protocol: 'https',
        hostname: 'mangalam.com',
      },
      {
        protocol: 'http',
        hostname: 'mangalam.cms',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=360, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
