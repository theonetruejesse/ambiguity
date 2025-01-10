import Link from "next/link";
import { Button } from "./ui/button";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}
export const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link href={href} className="hover:underline">
      {children}
    </Link>
  );
};

import { StatusTypes } from "~/app/tasks/_components/status";
import { cn } from "~/lib/utils";

type Status = {
  type: StatusTypes;
  label: string;
  color: string;
};
