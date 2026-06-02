import React from "react";
import { NavLink } from "react-router";

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-gray-200 px-4 py-2">
      <div>LOGO</div>
      <nav className="flex gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "bg-green-300" : "bg-gray-100"
          }
        >
          List
        </NavLink>
        <NavLink
          to="/create"
          className={({ isActive }) =>
            isActive ? "bg-green-300" : "bg-gray-100"
          }
        >
          Create
        </NavLink>
      </nav>
    </header>
  );
}
