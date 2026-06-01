import { createBrowserRouter } from "react-router";
import RootLayout from "../components/rootLayout/RootLayout";
import HomePage from "../pages/HomePage";
import TodosPage from "../pages/TodosPage";
import CreateTodoPage from "../pages/CreateTodoPage";
import PostsPage from "../pages/PostsPage";
import CreatePostPage from "../pages/CreatePostPage";
import ResourceLayout from "../components/rootLayout/ResourceLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "todos",
        element: <ResourceLayout basePath="/todos" />,
        children: [
          { index: true, element: <TodosPage /> },
          { path: "create", element: <CreateTodoPage /> },
        ],
      },
      {
        path: "posts",
        element: <ResourceLayout basePath="/posts" />,
        children: [
          { index: true, element: <PostsPage /> },
          { path: "create", element: <CreatePostPage /> },
        ],
      },
    ],
  },
]);
