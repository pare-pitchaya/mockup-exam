import axios from "axios";

//use axios object
export const api = axios.create({
  baseURL: "http://localhost:3000",
});
// api.get("/todos"); //http://localhost:3000/todos
// api.delete("test"); //http://localhost:3000/test
