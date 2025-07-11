// app/lib/auth.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export { authOptions };

export const getAuthSession = () => getServerSession(authOptions);

export const requireAuth = async () => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
};