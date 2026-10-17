import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH (e.g. "/faraz-portfolio") when deploying to a GitHub
// Pages project site. Leave unset for Vercel or a custom domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// The dev server blocks its own assets for any origin but localhost, so the
// site opened at this machine's LAN address (e.g. on a phone) ran without
// JavaScript. Allow every local IPv4 address, read at startup so a new DHCP
// lease needs no edit. Dev only: no effect on the static export.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net?.family === "IPv4" && !net.internal)
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  allowedDevOrigins: lanAddresses,
  // Pin the project root so Turbopack stops scanning the parent folder
  // (silences the multiple-lockfiles warning and speeds up cold starts).
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
