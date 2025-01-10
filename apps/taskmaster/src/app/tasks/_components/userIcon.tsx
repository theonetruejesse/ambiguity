"use client";

import { useUser } from "@clerk/nextjs";

export const UserIcon = () => {
  const { user } = useUser();
  return <div>{user?.fullName}</div>;
};
