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
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-sky-100"
        >
          <TodoIcon /> <span>Todos</span>
        </NavLink>
        <NavLink
          to="/posts"
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-sky-100"
        >
          <PostIcon /> <span>Posts</span>
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
