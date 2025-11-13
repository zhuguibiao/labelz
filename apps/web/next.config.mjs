/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@labelz/ui"],
  reactStrictMode: false,
  output: "export",
  basePath: '/labelz',
  assetPrefix: '/labelz/', 
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [
      "app",
      "bin",
      "config",
      "context",
      "hooks",
      "i18n",
      "models",
      "service",
      "test",
      "types",
      "utils",
    ],
  },
};

export default nextConfig;
