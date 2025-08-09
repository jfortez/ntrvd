import { TrpcProvider } from "@repo/trpc/client";
import AuthProvider from "@/providers/AuthProvider";

import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "./utils/trpc";

const UserView = () => {
  const { data } = useQuery(trpc.example.getExamples.queryOptions());
  const { mutate } = useMutation(trpc.auth.login.mutationOptions());

  const onLogin = () => {
    mutate({ email: "admin@example.com", password: "password123" });
  };

  console.log(data);
  return (
    <div>
      <button onClick={onLogin}>login</button>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <TrpcProvider>
        <UserView />
      </TrpcProvider>
    </AuthProvider>
  );
};

export default App;
