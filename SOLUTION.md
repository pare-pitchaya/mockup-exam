# คู่มือเขียนโปรเจกต์ Todo React

ไฟล์นี้เป็นคู่มือสำหรับเขียนโปรเจกต์เองแบบ step by step โดยไม่ต้องถาม AI ระหว่างสอบ อ่านใน VS Code ได้ด้วย Markdown Preview

## 1. ภาพรวมโปรเจกต์

โปรเจกต์นี้คือ Todo App ที่ทำงานหลัก ๆ ได้ดังนี้

- แสดงรายการ todos จาก server
- เพิ่ม todo ใหม่
- ลบ todo
- update สถานะ completed ด้วย checkbox
- search todo จากบางคำใน title โดยหน่วงเวลา 2 วินาที
- filter todo ด้วยปุ่ม All, Done, Todo
- ใช้ React Router แยกหน้า
- ใช้ TanStack React Query จัดการการดึงข้อมูลและ cache
- ใช้ axios เชื่อม API

## 2. Shape ของข้อมูล Todo

ข้อมูล todo 1 ตัวควรมีหน้าตาประมาณนี้

```js
{
  id: 1,
  title: "Learn React",
  completed: false
}
```

Type ที่ควรจำ

```txt
id: number หรือ string
title: string
completed: boolean
```

เวลาส่งข้อมูลไป create todo ใหม่

```js
{ title: "Learn React" }
```

เวลาส่งข้อมูลไป update completed

```js
{ id: 1, completed: true }
```

## 3. โครงสร้างไฟล์ที่ควรมี

```txt
src/
  main.jsx
  App.jsx
  routes/
    routes.jsx
  api/
    client.js
    todo.js
  hooks/
    useTodo.js
  pages/
    HomePage.jsx
    CreateTodoPage.jsx
    EditTodoPage.jsx
  components/
    Header.jsx
    RootLayout.jsx/RootLayout.jsx
    TodoList.jsx
    TodoItem.jsx
    TodoForm.jsx
    TodoSearch.jsx
```

หน้าที่ของแต่ละไฟล์

| ไฟล์ | หน้าที่ |
| --- | --- |
| `main.jsx` | จุดเริ่มต้นของ React เอา `<App />` ไป render |
| `App.jsx` | ครอบ app ด้วย `QueryClientProvider` และ `RouterProvider` |
| `routes.jsx` | กำหนด path ว่า URL ไหนแสดงหน้าไหน |
| `api/client.js` | สร้าง axios instance และ baseURL |
| `api/todo.js` | เขียน function สำหรับเรียก API: get, post, patch, delete |
| `hooks/useTodo.js` | สร้าง custom hooks ของ React Query |
| `HomePage.jsx` | หน้า list เรียกใช้ `TodoList` |
| `CreateTodoPage.jsx` | หน้า create เรียกใช้ `TodoForm` |
| `RootLayout.jsx` | layout กลาง มี Header และ Outlet |
| `Header.jsx` | navigation ไปหน้า List/Create |
| `TodoList.jsx` | ดึง todos, search, filter, map เป็น TodoItem |
| `TodoItem.jsx` | แสดง todo 1 แถว พร้อม checkbox/delete/edit |
| `TodoForm.jsx` | form สำหรับสร้าง todo ใหม่ |
| `TodoSearch.jsx` | input สำหรับ search title |

## 4. Flow การเชื่อมกันของไฟล์

เริ่มจาก app ทั้งหมด

```txt
main.jsx
  -> App.jsx
    -> QueryClientProvider
    -> RouterProvider
      -> routes.jsx
        -> RootLayout
          -> Header
          -> Outlet
            -> HomePage
              -> TodoList
                -> useTodos
                  -> getTodos
                    -> api.get("/todos")
                -> TodoSearch
                -> TodoItem
            -> CreateTodoPage
              -> TodoForm
                -> useCreateTodo
                  -> createTodo
                    -> api.post("/todos")
```

จำง่าย ๆ

```txt
page เรียก component
component เรียก hook
hook เรียก api function
api function เรียก server
```

## 5. Setup React Query ใน App.jsx

`useQuery` และ `useMutation` จะใช้ได้ ต้องมี `QueryClientProvider` ครอบ app ก่อน

```jsx
import { RouterProvider } from "react-router";
import { router } from "./routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

Logic ที่ต้องคิด

- `QueryClient` คือตัวจัดการ cache กลาง
- `QueryClientProvider` คือการส่ง queryClient ให้ component ข้างในใช้
- `RouterProvider` คือให้ app ใช้ routes ที่เราสร้างไว้

## 6. สร้าง routes.jsx

```jsx
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
```

Logic ที่ต้องคิด

- `path: "/"` คือ route หลัก
- `element: <RootLayout />` คือทุกหน้าใน children จะถูกครอบด้วย layout นี้
- `index: true` คือหน้าแรกของ `/`
- `path: "create"` คือ `/create`
- `path: "edit/:todoId"` คือ dynamic route เช่น `/edit/1`

## 7. RootLayout ทำอะไร

```jsx
import { Outlet } from "react-router";
import Header from "../Header";

export default function RootLayout() {
  return (
    <div>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
```

Logic ที่ต้องคิด

- `Header` แสดงทุกหน้า
- `Outlet` คือช่องที่เอาหน้าลูกมาแสดง
- ถ้าเข้า `/` ตรง Outlet จะเป็น `HomePage`
- ถ้าเข้า `/create` ตรง Outlet จะเป็น `CreateTodoPage`

## 8. เชื่อม API ด้วย axios

ไฟล์ `api/client.js`

```js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});
```

ถ้าเขียน

```js
api.get("/todos");
```

จะเท่ากับเรียก

```txt
http://localhost:3000/todos
```

## 9. เขียน api/todo.js

ไฟล์นี้มีหน้าที่คุยกับ server เท่านั้น

```js
import { api } from "./client";

export async function getTodos() {
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
```

Type ของ function

```txt
getTodos(): Promise<Todo[]>
createTodo(newTodo: { title: string }): Promise<Todo>
updateTodo({ id, ...body }: { id: number|string, completed?: boolean, title?: string }): Promise<Todo>
deleteTodo(id: number|string): Promise<Todo>
```

Logic ที่ต้องคิด

- `getTodos` ใช้ GET เพื่อดึง todos ทั้งหมด
- `createTodo` ใช้ POST เพื่อเพิ่ม todo
- `updateTodo` ใช้ PATCH เพื่อแก้บาง field เช่น completed
- `deleteTodo` ใช้ DELETE เพื่อลบ todo
- `const { data } = ...` คือดึงเฉพาะ data จาก response ของ axios

## 10. เขียน custom hooks ด้วย React Query

ไฟล์ `hooks/useTodo.js`

```js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../api/todo";

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
    staleTime: 10000,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```

Logic ที่ต้องคิด

- `useQuery` ใช้สำหรับ read data เช่น GET
- `useMutation` ใช้สำหรับ mutate data เช่น POST, PATCH, DELETE
- `queryKey: ["todos"]` คือชื่อ cache ของ todos
- `queryFn: getTodos` คือ function ที่ใช้ดึงข้อมูลจริง
- `mutationFn` คือ function ที่ใช้เปลี่ยนข้อมูลจริง
- `invalidateQueries({ queryKey: ["todos"] })` คือบอกว่า todos เก่าแล้ว ให้ refetch ใหม่

ทำไม `useQuery` ไม่ต้องใช้ `useQueryClient`

- เพราะ `useQuery` รู้ query ของตัวเองจาก `queryKey`
- แต่ `useMutation` ไม่รู้ว่าแก้ข้อมูลแล้วต้อง refetch query ไหน
- เลยต้องใช้ `queryClient.invalidateQueries(...)` เพื่อบอกเอง

## 11. HomePage และ CreateTodoPage

`HomePage.jsx`

```jsx
import TodoList from "../components/TodoList";

export default function HomePage() {
  return (
    <div>
      <TodoList />
    </div>
  );
}
```

`CreateTodoPage.jsx`

```jsx
import TodoForm from "../components/TodoForm";

export default function CreateTodoPage() {
  return (
    <div>
      <TodoForm />
    </div>
  );
}
```

Logic ที่ต้องคิด

- Page ไม่ควรมี logic เยอะ
- Page ทำหน้าที่เรียก component หลักของหน้านั้น

## 12. TodoList ทำอะไร

`TodoList` คือ component หลักของหน้า list

หน้าที่

- เรียก `useTodos()` เพื่อดึงข้อมูล
- แสดง loading/error/empty
- เก็บ state สำหรับ search
- หน่วง search 2 วินาที
- filter ด้วยปุ่ม All/Done/Todo
- map todos เป็น `TodoItem`

โค้ดหลัก

```jsx
import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import TodoSearch from "./TodoSearch";
import { useTodos } from "../hooks/useTodo";

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

  if (isLoading) return <p className="text-center text-gray-600">Loading.....</p>;
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
        <button onClick={() => setFilterStatus("all")}>All</button>
        <button onClick={() => setFilterStatus("done")}>Done</button>
        <button onClick={() => setFilterStatus("todo")}>Todo</button>
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
```

Type ที่รับจาก `useTodos`

```txt
todos: Todo[] | undefined
isLoading: boolean
isError: boolean
```

Type ของ state

```txt
searchText: string
debouncedSearchText: string
filterStatus: "all" | "done" | "todo"
```

## 13. Logic search แบบหน่วง 2 วินาที

ตัวแปรที่ใช้

```jsx
const [searchText, setSearchText] = useState("");
const [debouncedSearchText, setDebouncedSearchText] = useState("");
```

ความหมาย

- `searchText` คือค่าที่ user พิมพ์ทันที
- `debouncedSearchText` คือค่าที่จะเอาไปค้นหาจริง หลังรอ 2 วินาที

โค้ดหน่วงเวลา

```jsx
useEffect(() => {
  const timerId = setTimeout(() => {
    setDebouncedSearchText(searchText);
  }, 2000);

  return () => clearTimeout(timerId);
}, [searchText]);
```

Logic ที่ต้องคิด

1. user พิมพ์ใน input
2. `setSearchText` เปลี่ยนค่าทันที
3. `useEffect` ทำงานเพราะ `searchText` เปลี่ยน
4. `setTimeout` รอ 2 วินาที
5. ครบเวลาแล้วค่อยเอา `searchText` ไปใส่ `debouncedSearchText`
6. ถ้าพิมพ์ใหม่ก่อนครบ 2 วินาที `clearTimeout` จะยกเลิก timer เก่า

ทำไมใช้ `setTimeout` ไม่ใช้ `setInterval`

- `setTimeout` คือรอครั้งเดียวแล้วทำงาน เหมาะกับ debounce search
- `setInterval` คือทำซ้ำทุกช่วงเวลา ไม่เหมาะกับการรอหลังพิมพ์

## 14. Logic filter title

```jsx
const searchedTodos = todos?.filter((todo) =>
  todo.title.toLowerCase().includes(debouncedSearchText.toLowerCase())
);
```

Logic ที่ต้องคิด

- `filter` ใช้คัด array
- ถ้า return `true` จะเก็บ todo ตัวนั้นไว้
- ถ้า return `false` จะตัดออก
- `toLowerCase()` ทำให้ค้นหาแบบไม่สนตัวพิมพ์เล็ก/ใหญ่
- `includes()` เช็กว่ามีคำที่ search อยู่ใน title ไหม

ตัวอย่าง

```txt
title = "Learn React"
search = "rea"

"learn react".includes("rea") => true
```

## 15. Logic filter All / Done / Todo

```jsx
const filteredTodos = searchedTodos?.filter((todo) => {
  if (filterStatus === "done") return todo.completed;
  if (filterStatus === "todo") return !todo.completed;
  return true;
});
```

Logic ที่ต้องคิด

- ถ้าเลือก `done` ให้แสดงเฉพาะ `completed === true`
- ถ้าเลือก `todo` ให้แสดงเฉพาะ `completed === false`
- ถ้าเลือก `all` ให้ return `true` เพื่อแสดงทั้งหมด

ปุ่มเปลี่ยน filter

```jsx
<button onClick={() => setFilterStatus("all")}>All</button>
<button onClick={() => setFilterStatus("done")}>Done</button>
<button onClick={() => setFilterStatus("todo")}>Todo</button>
```

ลำดับการกรองในโปรเจกต์นี้

```txt
todos ทั้งหมด
  -> กรองด้วย search title
  -> กรองด้วย All/Done/Todo
  -> map เป็น TodoItem
```

## 16. TodoSearch ทำอะไร

```jsx
export default function TodoSearch({ value, onChange, isSearching }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search todo title..."
      />
      {isSearching && <p>Searching...</p>}
    </div>
  );
}
```

Props ที่รับ

```txt
value: string
onChange: function รับ string
isSearching: boolean
```

Logic ที่ต้องคิด

- `value={value}` ทำให้ input แสดงค่าจาก state
- `onChange={(e) => onChange(e.target.value)}` ส่งค่าที่พิมพ์กลับไปให้ parent
- `isSearching` ใช้บอกว่าค่าที่พิมพ์กับค่าที่ search จริงยังไม่เท่ากัน แปลว่ากำลังรอ 2 วินาที

## 17. TodoItem ทำอะไร

`TodoItem` คือ todo 1 แถว

```jsx
export default function TodoItem({ id, title, completed }) {
  const deleteTodo = useDeleteTodo();
  const updateTodo = useUpdateTodo();

  const handleDelete = () => {
    if (!id) return;
    deleteTodo.mutate(id);
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => updateTodo.mutate({ id, completed: !completed })}
      />

      <span className={completed ? "text-red-500 line-through" : ""}>
        {title}
      </span>

      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
```

Props ที่รับ

```txt
id: number | string
title: string
completed: boolean
```

Logic checkbox

```jsx
checked={completed}
```

checkbox จะแสดงตามค่า completed

```jsx
onChange={() => updateTodo.mutate({ id, completed: !completed })}
```

ตอนกด checkbox ให้ส่ง id และค่า completed ตรงข้ามไป update

ตัวอย่าง

```txt
completed เดิม = true
!completed = false

ส่งไป update:
{ id: 1, completed: false }
```

Logic delete

```jsx
deleteTodo.mutate(id);
```

ส่ง id ไปให้ API ลบ todo ตัวนั้น

## 18. TodoForm ทำอะไร

`TodoForm` ใช้สร้าง todo ใหม่

```jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCreateTodo } from "../hooks/useTodo";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const create = useCreateTodo();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    create.mutate({ title });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <button disabled={title.trim() === ""}>SAVE</button>
      <Link to="/">CANCEL</Link>
    </form>
  );
}
```

Type ของ state

```txt
title: string
```

Logic ที่ต้องคิด

- input เก็บค่า title ด้วย `useState`
- `onChange` เอาค่าที่พิมพ์ไปใส่ state
- submit form แล้วต้อง `e.preventDefault()` เพื่อไม่ให้ browser refresh
- ถ้า title เป็นช่องว่าง ไม่ให้ submit
- ถ้าผ่าน ให้ `create.mutate({ title })`
- หลัง create ให้กลับหน้า `/` ด้วย `navigate("/")`

## 19. Header ทำอะไร

```jsx
import { NavLink } from "react-router";

export default function Header() {
  return (
    <header>
      <div>LOGO</div>
      <nav>
        <NavLink to="/">List</NavLink>
        <NavLink to="/create">Create</NavLink>
      </nav>
    </header>
  );
}
```

Logic ที่ต้องคิด

- `NavLink` ใช้นำทางเหมือน `Link`
- จุดเด่นคือรู้ว่า path ปัจจุบัน active อยู่ไหม
- ใช้ `isActive` เพื่อเปลี่ยน class ของ menu ที่เลือกอยู่ได้

## 20. Checklist ตอนสอบควรเขียนลำดับไหนดี

ลำดับแนะนำ

1. สร้าง `api/client.js`
2. สร้าง `api/todo.js`
3. สร้าง `hooks/useTodo.js`
4. ตั้งค่า `App.jsx` ด้วย `QueryClientProvider` และ `RouterProvider`
5. สร้าง `routes.jsx`
6. สร้าง `RootLayout` และ `Header`
7. สร้าง pages: `HomePage`, `CreateTodoPage`, `EditTodoPage`
8. สร้าง `TodoItem`
9. สร้าง `TodoList` ให้ดึงข้อมูลและ map เป็น `TodoItem`
10. สร้าง `TodoForm` สำหรับ create
11. เพิ่ม update checkbox ใน `TodoItem`
12. เพิ่ม delete ใน `TodoItem`
13. เพิ่ม `TodoSearch`
14. เพิ่ม debounce search ใน `TodoList`
15. เพิ่มปุ่ม filter All/Done/Todo ใน `TodoList`

เหตุผลที่เรียงแบบนี้

- เริ่มจาก API ก่อน เพราะต้องรู้ว่าข้อมูลมาจากไหน
- ต่อด้วย hook เพราะ component จะเรียก hook
- ต่อด้วย route/page เพื่อให้มีหน้าทดสอบ
- ต่อด้วย component ชิ้นเล็กก่อน เช่น `TodoItem`
- แล้วค่อยประกอบเป็น list และ feature เพิ่มเติม

## 21. สูตรจำ React Query

อ่านข้อมูล

```jsx
useQuery({
  queryKey: ["todos"],
  queryFn: getTodos,
});
```

เปลี่ยนข้อมูล

```jsx
const queryClient = useQueryClient();

useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

จำง่าย ๆ

```txt
GET    -> useQuery
POST   -> useMutation
PATCH  -> useMutation
DELETE -> useMutation
```

## 22. สูตรจำ controlled input

input text

```jsx
const [title, setTitle] = useState("");

<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

checkbox

```jsx
<input
  type="checkbox"
  checked={completed}
  onChange={() => updateTodo.mutate({ id, completed: !completed })}
/>
```

จำง่าย ๆ

```txt
text input ใช้ e.target.value
checkbox ใช้ e.target.checked หรือ !completed
```

## 23. เปิด Markdown Preview

ใน VS Code

1. เปิดไฟล์ `SOLUTION.md`
2. กด `Cmd + Shift + V`
3. หรือคลิกขวา แล้วเลือก `Open Preview`

## 24. คำสั่งที่ใช้รันโปรเจกต์

รัน frontend

```bash
npm run dev
```

build ตรวจว่า compile ผ่าน

```bash
npm run build
```

preview หลัง build

```bash
npm run preview
```

API ของโปรเจกต์นี้เรียกไปที่

```txt
http://localhost:3000/todos
```

ดังนั้นตอนทดสอบจริงต้องมี backend หรือ json-server ที่เปิดอยู่ที่ port 3000 และมี resource ชื่อ `todos`

## 25. สรุป flow สำคัญที่สุด

ดึงข้อมูล todos

```txt
TodoList
  -> useTodos()
    -> useQuery()
      -> getTodos()
        -> api.get("/todos")
          -> server
```

สร้าง todo

```txt
TodoForm
  -> create.mutate({ title })
    -> useCreateTodo()
      -> createTodo({ title })
        -> api.post("/todos", { title })
      -> invalidateQueries(["todos"])
      -> TodoList refetch
```

update checkbox

```txt
TodoItem
  -> updateTodo.mutate({ id, completed: !completed })
    -> useUpdateTodo()
      -> updateTodo({ id, completed })
        -> api.patch("/todos/id", { completed })
      -> invalidateQueries(["todos"])
      -> TodoList refetch
```

delete todo

```txt
TodoItem
  -> deleteTodo.mutate(id)
    -> useDeleteTodo()
      -> deleteTodo(id)
        -> api.delete("/todos/id")
      -> invalidateQueries(["todos"])
      -> TodoList refetch
```

search และ filter

```txt
todos
  -> search title ด้วย debouncedSearchText
  -> filter ด้วย filterStatus
  -> map เป็น TodoItem
```

