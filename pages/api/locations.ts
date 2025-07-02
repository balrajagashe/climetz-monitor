// pages/api/locations.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { LOCATIONS_LIST } from '../../lib/constants';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1) Verify session token
  const token = await getToken({ req, secret: JWT_SECRET });
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2) Only allow GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  // 3) Return locations
  res.status(200).json(LOCATIONS_LIST);
}
