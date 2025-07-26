import { QueryClientProvider, useQuery } from "@tanstack/react-query";

import { queryClient } from "./utils/queryClient";
import { trpc } from "./utils/trpc";

const UserView = () => {
  const { data, isLoading, error } = useQuery(trpc.userList.queryOptions());

  console.log({ data, isLoading, error });
  return <div>users</div>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserView />
    </QueryClientProvider>
  );
};

export default App;
