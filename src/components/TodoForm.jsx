import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createTodo } from "../api/todo";
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
    <form
      action=""
      className="border rounded-lg p-4 flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="outline-none border rounded-lg px-3 py-1.5"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <div className="flex gap-4">
        <button
          className="border py-2 rounded-lg bg-green-300 px-4 w-full disabled:opacity-50"
          disabled={title.trim() === ""}
        >
          SAVE
        </button>
        <Link
          to="/"
          className="border py-2 rounded-lg bg-gray-300 px-4 w-full text-center"
        >
          CANCEL
        </Link>
      </div>
    </form>
  );
}
