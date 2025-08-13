import type { UserProfile } from "@/types/trpc";
import { createContext, useMemo } from "react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

type AuthContextType = {
  user?: UserProfile;
  isAuth: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user, isLoading } = useQuery(trpc.user.getProfile.queryOptions());

  const value = useMemo<AuthContextType>(() => {
    return {
      user: user,
      isAuth: !!user,
    };
  }, []);

  return <AuthContext.Provider value={value}>{isLoading ? null : children}</AuthContext.Provider>;
};

export default AuthProvider;
