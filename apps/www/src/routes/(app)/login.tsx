import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/login")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    // Redirect if already authenticated
    if (context.auth.isAuth) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();

  const handleLogin = () => {
    auth.login({ email: "admin@example.com", password: "password123" });
  };
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
