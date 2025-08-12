/** @type {import('next').NextConfig} */
const nextConfig = {};
/*
const nextConfig = {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: `
              default-src 'self';
              script-src 'self' 'nonce-random123' https://securepubads.g.doubleclick.net https://www.googletagservices.com https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.unibots.in https://cdn.unibotscdn.com;
              connect-src 'self' https://securepubads.g.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com https://cdn.unibots.in https://cdn.unibotscdn.com;
              img-src 'self' data: https://securepubads.g.doubleclick.net https://www.google-analytics.com https://www.googletagmanager.com https://cdn.unibots.in https://cdn.unibotscdn.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' data: https://fonts.gstatic.com;
            `.replace(/\n/g, ""),
            },
          ],
        },
      ];
    },
  }; */
  
export default nextConfig;
