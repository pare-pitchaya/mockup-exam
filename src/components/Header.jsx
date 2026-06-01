import { NavLink } from "react-router";
import logo from "../assets/cake.svg";

export default function Header({ basePath }) {
  return (
    <header className="flex flex-row items-center bg-sky-100 px-6 py-4 justify-between">
      <img src={logo} alt="Logo" width={60} height={60} />
      <h1 className="font-cute text-3xl font-bold">MOCKUP EXAM</h1>
      <nav className="flex gap-4 font-['Itim'] text-xl font-bold">
        <NavLink to={basePath}>List</NavLink>
        <NavLink to={`${basePath}/create`}>Create</NavLink>
      </nav>
    </header>
  );
}
