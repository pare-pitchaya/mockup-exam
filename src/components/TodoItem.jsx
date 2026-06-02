import { useState } from "react";
import { Link } from "react-router";
import { useDeleteTodo, useUpdateTodo } from "../hooks/useTodo";

//props ==> {id, title, completed}: RESTRUCTURING
export default function TodoItem({ id, title, completed }) {
  //   const [isCompleted, setIsCompleted] = useState(completed);
  const deleteTodo = useDeleteTodo();
  const handleDelete = () => {
    if (!id) return;
    deleteTodo.mutate(id);
  };
  //Use in other way in updateTodo
  const updateTodo = useUpdateTodo();

  return (
    <li className="flex justify-between items-center border rounded-lg px-4 py-2.5">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="size-4 accent-green-300"
          checked={completed}
          onChange={() => updateTodo.mutate({ id, completed: !completed })}
        />
        <span className={completed ? "text-red-500 line-through" : ""}>
          {title}
        </span>
      </div>
      <div className="space-x-2">
        <Link to={`/edit/${id}`} className="text-blue-300 hover:text-blue-600">
          Edit
        </Link>
        <button
          className="text-red-300 hover:text-red-600"
          onClick={handleDelete}
          disabled={deleteTodo.isPending}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
