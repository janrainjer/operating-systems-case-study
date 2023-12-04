/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "cdn1.iconfinder.com",
      "api.slingacademy.com",
      "lh3.googleusercontent.com",
      "10.3.22.3",
      "minio.pickausername.com",
      "minio:9000",
    ],
  },
  output: "standalone",
};

module.exports = nextConfig;
