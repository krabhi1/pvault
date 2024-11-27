import type { Metadata } from "next";

import "./globals.css";
import AppContext from "@/contexts/AppContext";

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
      </body>
    </html>
  );
}
