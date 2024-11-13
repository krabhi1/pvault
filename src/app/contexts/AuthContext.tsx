import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export type AuthContextType = {
  username: string;
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
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const isProtected = !unprotectedPaths.includes(path);

  useEffect(() => {
    //redirect to /signin path is protected and  not signin
    if (isProtected && !authData.isSignin) {
      navigate("/signin");
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
