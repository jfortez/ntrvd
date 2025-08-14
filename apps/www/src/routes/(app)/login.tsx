import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/login")({
  component: RouteComponent,
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/",
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuth) {
      throw redirect({ to: search.redirect });
    }
  },
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();

  const handleLogin = () => {
    auth.login({ email: "admin@example.com", password: "password123" });
    navigate({ to: redirect });
  };
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
