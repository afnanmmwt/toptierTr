import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // distDir: "build",
     productionBrowserSourceMaps: true,
  async rewrites() {

    return [
      {
        source: "/robots.txt",
        destination: "/robots",
      },
    ];
  },
 experimental: {
    optimizeCss: false
  },

   eslint: {
    ignoreDuringBuilds: true,
  },
  // ✅ Add this block to allow images from iata.co
  images: {
    remotePatterns: [
     {
  protocol: "https",
  hostname: "toptiertravel.vip",
  port: "",
  pathname: "/**", // allow everything
}
,
        {
      protocol: "https",
      hostname: "images.unsplash.com",
      port: "",
      pathname: "/**", // Unsplash doesn't need /storage
    },
        {
      protocol: "https",
      hostname: "flagpedia.net",
      port: "",
      pathname: "/**", // Unsplash doesn't need /storage
    },
    ],
  },
};

export default nextConfig;