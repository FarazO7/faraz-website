import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH (e.g. "/faraz-portfolio") when deploying to a GitHub
// Pages project site. Leave unset for Vercel or a custom domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
