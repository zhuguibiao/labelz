/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const isWebBuild = process.env.NEXT_PUBLIC_TARGET === "web";

console.log("platform:", process.env.NEXT_PUBLIC_TARGET);

const nextConfig = {
  basePath: isProd && isWebBuild ? "/labelz" : undefined,
  assetPrefix: isProd && isWebBuild ? "/labelz/" : undefined,
  reactStrictMode: false,
  output: "export",
  transpilePackages: ["@labelz/ui"],
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["app", "config", "hooks", "lib", "test", "types", "utils"],
  },
};

export default nextConfig;
