import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createBrowserHistory } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.tsx";

const browserHistory = createBrowserHistory();

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  history: browserHistory,
  context: { queryClient },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
