/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["ipfs-utils"],
  },
};

module.exports = nextConfig;
