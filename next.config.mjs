/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["mongoose", "bcryptjs"],
};

export default nextConfig;
