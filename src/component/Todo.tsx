import { useEffect, useState } from "react";

// Define TypeScript interface for todo items
interface TodoItem {
  id: string[];
  todoss: string[];
  _id: string;
}

export default function Todo() {
  const [todo, setTodo] = useState("");
  const [getTodo, setGetTodo] = useState<TodoItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/user/todo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      });
      const data = await res.json();
      setGetTodo(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/user/todo', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ todo }),
      });
      setTodo(""); // Clear input
      fetchTodos(); // Update UI
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/v1/user/todo/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchTodos();
    } catch (e) {
      console.log(e);
    }
  };

  const handleEdit = async (id: string, newTodo: string) => {
    try {
      await fetch(`http://localhost:3000/api/v1/user/todo/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ todo: newTodo }),
      });
      setEditingId(null);
      setEditText("");
      fetchTodos();
    } catch (e) {
      console.log(e);
    }
  };

  const startEditing = (id: string, currentTodo: string) => {
    setEditingId(id);
    setEditText(currentTodo);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Add todo"
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add
        </button>
      </div>
      <div>
        {getTodo.map((item, idx) => (
          <div key={idx} className="mb-2">
            {item.todoss.map((t: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                {editingId === item.id[i] ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border p-1 rounded"
                    />
                    <button
                      onClick={() => handleEdit(item.id[i], editText)}
                      className="bg-green-500 text-white p-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white p-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>{t}</p>
                    <button
                      onClick={() => startEditing(item.id[i], t)}
                      className="bg-yellow-500 text-white p-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id[i])}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}