import Link from "next/link";

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
