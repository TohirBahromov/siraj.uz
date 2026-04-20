import type { NextConfig } from "next";

const apiHostname = (() => {
  try {
    const h = new URL(process.env.NEXT_PUBLIC_API_URL ?? "").hostname;
    return h && h !== "localhost" ? h : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "http", hostname: "localhost" },
      ...(apiHostname ? [{ protocol: "https" as const, hostname: apiHostname }] : []),
    ],
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
