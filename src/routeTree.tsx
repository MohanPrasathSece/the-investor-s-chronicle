import { createRootRoute, createRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// Lazy-load pages for code splitting
const IndexPage = lazy(() => import("./pages/Index"));
const EnquiryPage = lazy(() => import("./pages/Enquiry"));
const PrivacyPage = lazy(() => import("./pages/Privacy"));
const TermsPage = lazy(() => import("./pages/Terms"));

// Root route — wraps all pages
const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0a10]" />}>
      <Outlet />
    </Suspense>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  ),
});

// Index route: /
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <IndexPage />
    </Suspense>
  ),
});

// Enquiry route: /enquiry
const enquiryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/enquiry",
  component: () => (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0a10]" />}>
      <EnquiryPage />
    </Suspense>
  ),
});

// Privacy route: /privacy
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: () => (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PrivacyPage />
    </Suspense>
  ),
});

// Terms route: /terms
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: () => (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <TermsPage />
    </Suspense>
  ),
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  enquiryRoute,
  privacyRoute,
  termsRoute,
]);
