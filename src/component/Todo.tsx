import { useEffect, useState } from "react";

export default function Todo() {
  const [todo, setTodo] = useState("");
  const [getTodo, setGetTodo] = useState<any[]>([]);

  const fetchTodos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/user/todo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      });
      console.log(res)
      const data = await res.json();
      setGetTodo(data);
    } catch (e) {
      console.error(e);
    }
  }

  const handleAdd = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/user/todo', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ todo })
      });
      setTodo(""); // clear input
      fetchTodos(); // update UI
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <div className="h-10 w-[fit]">
        <input 
          placeholder="add todo" 
          type="text" 
          value={todo} 
          onChange={(e) => setTodo(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <div>
        {getTodo.map((item, idx) => (
          <div key={idx}>
            {item.todoss.map((t: string, i: number) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
