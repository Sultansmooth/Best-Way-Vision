/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output only for Docker builds
  // Vercel needs standard output mode
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
}

module.exports = nextConfig
