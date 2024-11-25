import type { Metadata } from "next";

import "./globals.css";
import AllProvider from "./AllProvider";

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
        <AllProvider>{children}</AllProvider>
      </body>
    </html>
  );
}
