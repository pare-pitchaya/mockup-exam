import { api } from "./client";

export async function getTodos() {
  //   throw new Error("Error Message"); //TEST ERROR
  //return new Promise((r) => setTimeout(() => r([]), 50000)); //TEST TODO NOT FOUND

  const { data } = await api.get("/todos");
  return data;
}
export async function createTodo(newTodo) {
  const { data } = await api.post("/todos", newTodo);
  return data;
}
export async function updateTodo({ id, ...body }) {
  const { data } = await api.patch(`/todos/${id}`, body);
  return data;
}

export async function deleteTodo(id) {
  const { data } = await api.delete(`/todos/${id}`);
  return data;
}
