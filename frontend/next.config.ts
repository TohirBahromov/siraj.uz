import type { NextConfig } from "next";

const remotePatterns: NextConfig["images"]["remotePatterns"] = [
  { protocol: "https", hostname: "placehold.co" },
  { protocol: "http", hostname: "localhost" },
];

// Allow images from the production API host (e.g. api.yourdomain.com)
if (process.env.NEXT_PUBLIC_API_URL) {
  try {
    const apiHostname = new URL(process.env.NEXT_PUBLIC_API_URL).hostname;
    if (apiHostname !== "localhost") {
      remotePatterns.push({ protocol: "https", hostname: apiHostname });
    }
  } catch {}
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: { remotePatterns },
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
