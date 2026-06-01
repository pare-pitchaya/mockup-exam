import { NavLink, useLocation } from "react-router";
import logo from "../assets/cake.svg";

export default function Header() {
  // Get the current URL path, such as "/", "/todos", or "/posts/create".
  const { pathname } = useLocation();

  // Extract the first path segment to know the current resource section.
  const firstPath = pathname.split("/")[1];

  // Build the base path for List/Create links. Default to todos on the home page.
  const basePath = firstPath ? `/${firstPath}` : "/todos";

  return (
    <header className="flex flex-row items-center bg-sky-100 px-6 py-4 justify-between">
      <img src={logo} alt="Logo" width={60} height={60} />
      <h1 className="font-cute text-3xl font-bold">MOCKUP EXAM</h1>
      <nav className="flex gap-4 font-['Itim'] text-xl font-bold">
        <NavLink
          to={basePath}
          end
          className={({ isActive }) =>
            isActive ? "bg-yellow-200 font-extrabold" : "text-stone-500"
          }
        >
          List
        </NavLink>
        <NavLink
          to={`${basePath}/create`}
          className={({ isActive }) =>
            isActive ? "bg-yellow-200 font-extrabold" : "text-stone-500"
          }
        >
          Create
        </NavLink>
      </nav>
    </header>
  );
}
