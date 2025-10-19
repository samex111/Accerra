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
   const a  = getTodo.map(item=>item.id)
   console.log(a)

  const handleAdd = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/user/todo', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ todo })
      });
      setTodo(""); // clear input
      fetchTodos(); // update UI
    } catch (e) {
      console.log(e)
    }
  }
  const handleDelete = async () =>{
    try{
        await fetch(`http://localhost:3000/api/v1/user/todo/68f2fb3a4e1d1af9ec47fb5b`, {
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        })
    }catch(e){
  console.log(e)
    }
  }

  useEffect(() => {
    fetchTodos();
  handleDelete();
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
