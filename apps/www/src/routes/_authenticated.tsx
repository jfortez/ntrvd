import { createFileRoute } from "@tanstack/react-router";
import { Link, Outlet, redirect, useRouter } from "@tanstack/react-router";

import { useAuth } from "@/providers/Auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    console.log(context, location);
    if (!context.auth.isAuth) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: "/" });
        });
      });
    }
  };

  return (
    <div className="p-2 h-full">
      <h1>Authenticated Route</h1>
      <p>This route's content is only visible to authenticated users.</p>

      <hr />
      <Outlet />
    </div>
  );
}
