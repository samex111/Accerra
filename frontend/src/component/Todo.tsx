import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "@/config/env";

interface TodoGroup {
  _id: string;       // date
  todoss: string[];
  id: string[];
}

export default function Todo() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<TodoGroup[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const todayTodos = useMemo(() => {
    return data.find(d => d._id === today);
  }, [data, today]);

  async function fetchTodos() {
    const res = await fetch(`${API_URL}/api/v1/user/todo`, {
      credentials: "include",
    });
    const json = await res.json();
    setData(json);
  }

  async function addTodo() {
    if (!input.trim()) return;
    await fetch(`${API_URL}/api/v1/user/todo`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: input }),
    });
    setInput("");
    fetchTodos();
  }

  async function deleteTodo(id: string) {
    await fetch(`${API_URL}/api/v1/user/todo/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchTodos();
  }

  async function saveEdit(id: string) {
    await fetch(`${API_URL}/api/v1/user/todo/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: editText }),
    });
    setEditingId(null);
    setEditText("");
    fetchTodos();
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Pen className="h-4 w-4" />
        <h2 className="font-semibold">Todo List</h2>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={addTodo}>Add</Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {!todayTodos && (
          <p className="text-sm text-muted-foreground">
            No todos for today
          </p>
        )}

        {todayTodos?.todoss.map((t, i) => {
          const id = todayTodos.id[i];

          return (
            <div
              key={id}
              className="flex items-center gap-2 rounded-md border p-2"
            >
              {editingId === id ? (
                <>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <Button size="sm" onClick={() => saveEdit(id)}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <p className="flex-1 truncate">{t}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(id);
                      setEditText(t);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTodo(id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
