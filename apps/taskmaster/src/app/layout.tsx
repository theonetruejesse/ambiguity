import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { serverUrl } from "~/constants";
import { TRPCReactProvider } from "manipulator/clients/next";

export const metadata: Metadata = {
  title: "Taskmaster",
  description: "dasein's taskmaster",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider baseUrl={serverUrl}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
