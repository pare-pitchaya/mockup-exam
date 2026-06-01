import { MessageSquareText } from "lucide-react";
import { ListTodo } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

export default function Navigation() {
  console.log("Navigation Run");
  return (
    <aside className="w-fit shrink-0 bg-pink-200 p-4">
      <nav className="flex flex-col gap-3 font-['Itim'] text-xl font-bold">
        <NavLink
          to="/todos"
          className={({ isActive }) =>
            isActive
              ? "rounded-md bg-yellow-200 px-3 py-2 font-extrabold"
              : "rounded-md px-3 py-2 text-stone-500 hover:bg-sky-100"
          }
        >
          <span className="flex items-center gap-2">
            <TodoIcon /> <span>Todos</span>
          </span>
        </NavLink>
        <NavLink
          to="/posts"
          className={({ isActive }) =>
            isActive
              ? "rounded-md bg-yellow-200 px-3 py-2 font-extrabold"
              : "rounded-md px-3 py-2 text-stone-500 hover:bg-sky-100"
          }
        >
          <span className="flex items-center gap-2">
            <PostIcon /> <span>Posts</span>
          </span>
        </NavLink>
      </nav>
    </aside>
  );
}

const TodoIcon = () => {
  return <ListTodo size={18} />;
};
const PostIcon = () => {
  return <MessageSquareText size={18} />;
};
