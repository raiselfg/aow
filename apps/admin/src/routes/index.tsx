import { createFileRoute, redirect } from '@tanstack/react-router';
import { Spinner } from '@aow/ui/components/spinner';

import { SignInForm } from '@/components/signin-form';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data?.session) {
      throw redirect({ to: '/dashboard' });
    }
  },
  pendingComponent: () => (
    <div className='flex h-screen items-center justify-center'>
      <Spinner />
    </div>
  ),
  component: Index,
});

function Index() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <SignInForm />
    </div>
  );
}
