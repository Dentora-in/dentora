/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@prisma/client", "@dentora/database"],
}

export default nextConfig
