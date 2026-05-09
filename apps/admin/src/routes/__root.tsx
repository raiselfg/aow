import type { QueryClient } from '@tanstack/react-query';

import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

interface MyRouterContext {
  queryClient: QueryClient;
}

const RootLayout = () => (
  <>
    <Outlet />
  </>
);

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});
