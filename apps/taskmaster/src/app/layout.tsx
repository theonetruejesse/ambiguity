import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { serverUrl } from "~/constants";
import { TRPCReactProvider } from "manipulator/clients/next/react";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Taskmaster",
  description: "dasein's taskmaster",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider baseUrl={serverUrl}>
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

const MainLayout = ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <TopNav />
      <main className="w-full max-w-screen-lg">{children}</main>
    </div>
  );
};
