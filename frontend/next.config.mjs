/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: process.env.BACKEND_URI + "/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
