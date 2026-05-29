const nextConfig = {
  allowedDevOrigins: ['dev.mangalam.com', 'www.mangalam.com', 'mangalam.com', 'images.mangalam.com', 'mangalam.cms', 'img.youtube.com'],  
  images: {
    minimumCacheTTL: 31536000, // Cache for 1 year to minimize hits to images.mangalam.com
	dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.mangalam.com',
		pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'mangalam.com',
      },
      {
        protocol: 'https',
        hostname: 'mangalam.com',
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
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
            value: 'public, s-maxage=360, stale-while-revalidate=360',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
