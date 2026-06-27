import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["drizzle-kit"],
  outputFileTracingExcludes: {
    "*": [
      "./src/db/migrations/**",
      "./node_modules/drizzle-kit/**",
      "./node_modules/@esbuild/**",
    ],
  },
};

export default nextConfig;
