"use client";
import { AuthProvider } from "./contexts/AuthContext";

export default function AllProvider({ children }: React.PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
