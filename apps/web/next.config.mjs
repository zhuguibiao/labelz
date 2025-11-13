/** @type {import('next').NextConfig} */
console.log("PAGES_BASE_PATH:", process.env.PAGES_BASE_PATH);
const nextConfig = {
  transpilePackages: ["@labelz/ui"],
  reactStrictMode: false,
  output: "export",
  basePath: process.env.PAGES_BASE_PATH,
  
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
