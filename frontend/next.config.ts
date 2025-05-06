import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "@/env.ts";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  // cacheHandler:
  //   process.env.NODE_ENV === "production"
  //     ? require.resolve("./src/cache-handler.js")
  //     : undefined,
  // Recommended: this will reduce output
  // Docker image size by 80%+
  output: "standalone",
  // Traefik will do gzip compression. We disable
  // compression here so we can prevent buffering
  // streaming responses
  compress: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shop.vinfastauto.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/wikipedia/commons/thumb/0/0b/Douala.jpg/1200px-Douala.jpg",
      },
    ],
  },
};
export default withNextIntl(nextConfig);
