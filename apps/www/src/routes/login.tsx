import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import Login from "@/components/Login";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
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
  return <Login onSubmit={handleLogin} />;
}
