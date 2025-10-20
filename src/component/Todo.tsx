import { useEffect, useState } from "react";

export default function Todo() {
  const [todo, setTodo] = useState("");
  const [getTodo, setGetTodo] = useState<any[]>([]);
  const [editTodo,setEditTodo] = useState('');
  const [isedit,setIsEdit] = useState(false);
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
   const d  = a[0];
  //  console.log("d:",d[0]) 
  console.log(todo)
  const handleAdd = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/user/todo', {
        method: "POST",
        headers:{'Content-Type':'application/json'},
        credentials: "include",
        body: JSON.stringify({ todo })
      });
      setTodo(""); // clear input
      fetchTodos(); // update UI
    } catch (e) {
      console.log(e)
    }
  }
  function edit(editText:string){
    
    return(
      <>
      </>
    )
  }
  const handleDelete = async (id:string) =>{
    try{
        await fetch(`http://localhost:3000/api/v1/user/todo/${id}`, {
        method:"DELETE",
        // headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        })
         fetchTodos();
    }catch(e){
  console.log(e)
    }
  }
  const handleEdit = async (id:string) =>{
    try{
        await fetch(`http://localhost:3000/api/v1/user/todo/${id}`, {
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        })
         fetchTodos();
    }catch(e){
  console.log(e)
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);
  console.log(isedit)

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
              <p key={i}>{t}
               <button className="p-2" onClick={()=>handleDelete(d[i])}>delete</button>
               <button onClick={()=>setIsEdit(!isedit)}>edit</button>
               {
                isedit && (
              <input type="text" value={t} onChange={(e)=>setEditTodo(e.target.value)}/>
                    
                  
                )
               }
               </p>
                            
              )
              
            )}
          </div>
        ))}

      </div>
    </>
  )
}
