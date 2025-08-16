import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/register")({
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
  return <div>Hello "/register"!</div>;
}
