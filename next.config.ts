import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.CF_PAGES === "1" ? "export" : undefined,
  typescript: {
    tsconfigPath: process.env.CF_PAGES === "1" ? "./tsconfig.pages.json" : "./tsconfig.json",
  },
};

export default nextConfig;
