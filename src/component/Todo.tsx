import { useEffect, useState } from "react";

export default function Todo() {
    const [todo, setTodo] = useState([]);

    const handleAdd = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/user/todo', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ todo })                      
            });
            const data = await res.json();    
            console.log(data);
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(()=>{
        try{
            const res = await fetch('')
        }
    },[])
    
    return (
        <>
            <div className="h-10 w-[fit]">
                <input placeholder="add todo" type="text" value={todo} onChange={(e:any)=>{setTodo(e.target.value)}}/>
                 <button onClick={handleAdd}>Add</button>
            </div>
        </>
)
}