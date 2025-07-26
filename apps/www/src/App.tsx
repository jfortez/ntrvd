import { TrpcProvider } from "@repo/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "./utils/trpc";

const UserView = () => {
  const { data, isLoading, error } = useQuery(trpc.example.getExamples.queryOptions());

  console.log({ data, isLoading, error });
  return <div>users</div>;
};

const App = () => {
  return (
    <TrpcProvider>
      <UserView />
    </TrpcProvider>
  );
};

export default App;
