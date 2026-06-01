import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../api/todos";

export function useTodo() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
    staleTime: 10000,
  });
}
