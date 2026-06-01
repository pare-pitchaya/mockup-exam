import { NavLink, useLocation } from "react-router";
import logo from "../assets/cake.svg";

export default function Header() {
  const { pathname } = useLocation();
  const firstPath = pathname.split("/")[1];
  const basePath = firstPath ? `/${firstPath}` : "/todos";

  return (
    <header className="flex flex-row items-center bg-sky-100 px-6 py-4 justify-between">
      <img src={logo} alt="Logo" width={60} height={60} />
      <h1 className="font-cute text-3xl font-bold">MOCKUP EXAM</h1>
      <nav className="flex gap-4 font-['Itim'] text-xl font-bold hover:bg-emerald-100">
        <NavLink
          to={basePath}
          className={({ isActive }) =>
            isActive ? "bg-yellow-200 font-extrabold" : "text-stone-500"
          }
        >
          List
        </NavLink>
        <NavLink to={`${basePath}/create`}>Create</NavLink>
      </nav>
    </header>
  );
}
