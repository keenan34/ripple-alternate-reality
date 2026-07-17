import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "192.168.68.66"],
  devIndicators: false,
};

export default nextConfig;
