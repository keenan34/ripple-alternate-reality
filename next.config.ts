import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add your machine's LAN address here to play on a phone against `npm run dev`.
  allowedDevOrigins: ["127.0.0.1", ...(process.env.DEV_LAN_ORIGIN ? [process.env.DEV_LAN_ORIGIN] : [])],
  devIndicators: false,
};

export default nextConfig;
