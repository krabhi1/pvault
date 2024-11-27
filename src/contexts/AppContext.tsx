"use client";
import { AuthProvider } from "./AuthContext";

export default function AppContext({ children }: React.PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
