// pages/api/stations.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { mockDataLocation1 } from '../../data/mockData';

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

  // 3) (Later) you’ll parse req.query.location/from/to
  // For now, always return the full mock dataset:
  res.status(200).json(mockDataLocation1);
}
