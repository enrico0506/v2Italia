/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
        ],
      },
    ];
  },

  images: {
    // Local images from /public are always allowed.
    // Add remote patterns here if you later host product images on a CDN.
    remotePatterns: [],
  },
  experimental: {
    // Keep default; enable only if you know why you need it.
  },
};

export default nextConfig;
