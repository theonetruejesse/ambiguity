"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const TopNav = () => {
  const router = useRouter();
  return (
    <nav className="mb-3 flex w-full items-center justify-between border-b px-6 py-4 text-xl font-semibold">
      <div>Taskmaster</div>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};
