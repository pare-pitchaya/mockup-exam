import axios from "axios";

//#1: Use localhost to ba a database(pnpm dev => use backend by url)
export const api = axios.create({
  baseURL: "http://localhost:3000",
});
