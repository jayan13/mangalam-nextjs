const nextConfig = {
  allowedDevOrigins: ['dev.mangalam.com'],
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
