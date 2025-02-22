import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photos.tinknernerd.dev",
        port: "",
      },
    ],
  },
};

export default nextConfig;
