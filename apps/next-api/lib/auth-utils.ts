import { auth } from './auth';
import { headers } from 'next/headers';
import { UnauthorizedError } from './errors';

export async function requireAdminAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new UnauthorizedError('Unauthorized: Требуется авторизация в админке');
  }

  return session;
}
