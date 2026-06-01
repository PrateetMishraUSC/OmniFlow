import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/extension-accelerate",
    "@prisma/adapter-prisma-postgres",
  ],
};

export default nextConfig;
