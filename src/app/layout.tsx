import type { Metadata } from "next";

import "./globals.css";
import AppContext from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "pvault",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppContext>{children}</AppContext>
        <Toaster />
      </body>
    </html>
  );
}
