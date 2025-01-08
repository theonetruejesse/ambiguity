import { NavLink } from "~/components/myButtons";

export default async function HomePage() {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Home</h1>
      <NavLink href="/tasks">Tasks</NavLink>
    </div>
  );
}
