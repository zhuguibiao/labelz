/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  transpilePackages: ["@labelz/ui"],
  reactStrictMode: false,
  output: "export",
  basePath: isProd ? "/labelz" : "",
  assetPrefix: isProd ? "/labelz/" : "",
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["app", "config", "hooks", "lib", "test", "types", "utils"],
  },
};

export default nextConfig;
