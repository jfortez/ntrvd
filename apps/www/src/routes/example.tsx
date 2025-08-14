import Spinner from "@/components/Spinner";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/example")({
  component: RouteComponent,
  errorComponent: () => "Oh crap!",
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(trpc.example.getExamples.queryOptions());
    return;
  },
  pendingComponent: Spinner,
});

function RouteComponent() {
  const { data } = useQuery(trpc.example.getExamples.queryOptions());

  return (
    <div>
      Total items {data?.length}
      <ul>
        {data?.map((item) => {
          return (
            <li key={item.id} className="flex items-center gap-4">
              <span>{item.foo}</span>
              <span>{item.bar}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
