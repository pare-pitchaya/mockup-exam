import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import React from "react";

export default function TodoItem() {
  return (
    <li>
      <div>
        <input type="text" />
        <span></span>
      </div>
      <div>
        <button ype="button" aria-label="Edit todo">
          {EditIcon}
        </button>
        <button type="button" aria-label="Delete todo">
          {DeleteIcon}
        </button>
      </div>
    </li>
  );
}

const EditIcon = () => {
  return <Pencil size={18} />;
};
const DeleteIcon = () => {
  return <Trash2 size={18} />;
};
