import { NextConfig } from 'next';
import { env } from 'process';

const devOrigins = env.REPLIT_DOMAINS
  ? env.REPLIT_DOMAINS.split(',').map(d => d.trim())
  : [];  // empty array when undefined

const nextConfig: NextConfig = {
  // only include allowedDevOrigins in development
  ...(process.env.NODE_ENV === 'development' && devOrigins.length > 0
    ? { allowedDevOrigins: [devOrigins[0]] }
    : {}),
};

export default nextConfig;
