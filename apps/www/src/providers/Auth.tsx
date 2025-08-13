import type { LoginArgs, UserProfile } from "@/types/trpc";
import { createContext, useContext, useMemo } from "react";
import { trpc } from "@/utils/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type AuthContextType = {
  user?: UserProfile;
  isAuth: boolean;
  login: (args: LoginArgs) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading, refetch } = useQuery(trpc.user.getProfile.queryOptions());
  const { mutateAsync: loginMutation } = useMutation(trpc.auth.login.mutationOptions());
  const { mutateAsync: logoutMutation } = useMutation(trpc.auth.logout.mutationOptions());

  const login = async (args: LoginArgs) => {
    await loginMutation(args);
    await refetch();
  };

  const logout = async () => {
    await logoutMutation();
    queryClient.setQueryData(trpc.user.getProfile.queryKey(), undefined);
  };

  const value = useMemo<AuthContextType>(() => {
    return {
      user: user,
      isAuth: !!user,
      login,
      logout,
    };
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
