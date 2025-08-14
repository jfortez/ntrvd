import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-svh">
      <div>Dashboard Layout</div>
      <Outlet />
    </div>
  );
}
