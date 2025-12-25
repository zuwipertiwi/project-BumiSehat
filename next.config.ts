import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    middlewareSignatureV2: true,
  },
};

export default nextConfig;
