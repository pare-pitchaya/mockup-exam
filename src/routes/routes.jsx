import { createBrowserRouter } from "react-router";
import HomePage from "../pages/HomePage";
import CreateTodoPage from "../pages/CreateTodoPage";
import EditTodoPage from "../pages/EditTodoPage";
import RootLayout from "../components/RootLayout.jsx/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "create", element: <CreateTodoPage /> },
      { path: "edit/:todoId", element: <EditTodoPage /> },
    ],
  },
]);
