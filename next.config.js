/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/PasarKita",
  assetPrefix: "/PasarKita/",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
