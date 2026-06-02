import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import TodoSearch from "./TodoSearch";
import { useTodos } from "../hooks/useTodo";

//useQuery ==> fetch data (read)
//useMutation ==> mutate data (create,update,delete)
export default function TodoList() {
  const { data: todos, isLoading, isError } = useTodos();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 2000);

    return () => clearTimeout(timerId);
  }, [searchText]);

  const searchedTodos = todos?.filter((todo) =>
    todo.title.toLowerCase().includes(debouncedSearchText.toLowerCase())
  );

  const filteredTodos = searchedTodos?.filter((todo) => {
    if (filterStatus === "done") return todo.completed;
    if (filterStatus === "todo") return !todo.completed;
    return true;
  });

  ////////USE CUSTOM HOOK in useTodo.js///////
  //   const {
  //     data: todos,
  //     isLoading,
  //     isError,
  //   } = useQuery({
  //     queryKey: ["todos"], //['todos']
  //     queryFn: getTodos, //data from server: [todo object] <== fetch data
  //     // cache ==> {'todo': datafrom server}
  //   });
  if (isLoading)
    return <p className="text-center text-gray-600">Loading.....</p>;
  if (isError) return <p className="text-center text-red-600">Error!!</p>;
  if (todos.length === 0) return <p className="text-center">No todos found</p>;
  return (
    <div>
      <TodoSearch
        value={searchText}
        onChange={setSearchText}
        isSearching={searchText !== debouncedSearchText}
      />

      <div className="mb-4 flex gap-2">
        <button
          className={`rounded-lg border px-4 py-2 ${
            filterStatus === "all" ? "bg-green-300" : "bg-white"
          }`}
          onClick={() => setFilterStatus("all")}
        >
          All
        </button>
        <button
          className={`rounded-lg border px-4 py-2 ${
            filterStatus === "done" ? "bg-green-300" : "bg-white"
          }`}
          onClick={() => setFilterStatus("done")}
        >
          Done
        </button>
        <button
          className={`rounded-lg border px-4 py-2 ${
            filterStatus === "todo" ? "bg-green-300" : "bg-white"
          }`}
          onClick={() => setFilterStatus("todo")}
        >
          Todo
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <p className="text-center">No matching todos found</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} {...todo} />
          ))}
        </ul>
      )}
    </div>
  );
}
