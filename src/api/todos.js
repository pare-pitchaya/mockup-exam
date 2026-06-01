import { api } from "./client";

export async function getTodos() {
  const { data } = await api.get("/todos");
  return data;
}
