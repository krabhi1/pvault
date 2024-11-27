import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

export type AuthContextType = {
  username: string;
  password: string;
  signout: () => void;
  signinOrsignup: (name: string) => void;
  isSignin: boolean;
};
const AuthContext = createContext<AuthContextType | null>(null);
type AuthContextProviderProps = React.PropsWithChildren<{}>;
export function AuthProvider({ children }: AuthContextProviderProps) {
  const unprotectedPaths = ["/signin", "/signout"];
  const [authData, setAuthData] = useImmer<AuthContextType>({
    username: "abhi",
    password: "123",
    isSignin: true,
    signinOrsignup(name) {
      setAuthData((draft) => {
        draft.isSignin = true;
        draft.username = name;
      });
    },
    signout() {
      setAuthData((draft) => {
        draft.isSignin = false;
      });
    },
  });
  const path = usePathname();
  const router = useRouter();
  const isProtected = !unprotectedPaths.includes(path);

  useEffect(() => {
    //redirect to /signin path is protected and  not signin
    if (isProtected && !authData.isSignin) {
      router.push("/signin");
    }
  }, [isProtected, authData.isSignin]);

  if (isProtected && !authData.isSignin) {
    return null;
  }

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const authData = useContext(AuthContext);
  if (!authData) throw new Error("useAuth must be called inside AuthProvider");
  return authData;
}
