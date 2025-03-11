import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "ojidfdenb7y83wtm.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
