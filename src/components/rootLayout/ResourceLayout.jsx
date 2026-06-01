import { Outlet } from "react-router";
import Header from "../Header";

export default function ResourceLayout({ basePath }) {
  return (
    <>
      <Header basePath={basePath} />
      <Outlet />
    </>
  );
}
