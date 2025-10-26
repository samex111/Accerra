        import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [isShowHistory,setIsShowHistory] = useState(false);
  const [history,setHistory] = useState([])

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
  console.log(getTodo)
  const d = new Date()
  const dateStr = d.toISOString().slice(0, 10);
  console.log('dateStr:',dateStr) 
  const todayTodo = getTodo.filter(item=>item._id===dateStr)
  console.log("today date: ",todayTodo)
  //  me filter kar sakta hu today ki date ko and then uske based par 
  // todos show kar sakta hu 
  // test this code tomarrow 
   const todossss = todayTodo.map(item=>item.todoss)
   console.log("only today: ",todossss[0])
   console.log(getTodo)
   const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

console.log('Today:', today.toDateString());
console.log('Yesterday:', yesterday.toDateString());

   
  return (
    <div className="p-4 border-gray-500 shadow-md border w-fit h-fit">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add todo"
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="bg-gradient-to-r from-pink-300 to-blue-200 placeholder:text-black text-black"
        />
        <Button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-900"
        >
          Add
        </Button>
        <Button onClick={()=>setIsShowHistory(!isShowHistory)} className="ml-2 bg-gray-500 rounded-md p-2 text-white">history</Button>
      </div>


      <div>
        {todayTodo.map((item, idx) => (
          <div key={idx} className="mb-2">
            {item.todoss.map((t: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                {editingId === item.id[i] ? (
                  <>
                    <Input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <Button
                      onClick={() => handleEdit(item.id[i], editText)}

                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="w-[20vw]">{t}</p>
                    <Button
                      onClick={() => startEditing(item.id[i], t)}
                    > 
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id[i])}
                    >
                      Delete
                    </Button>
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