import { useEffect, useState } from "react";

export default function Todo() {
    const [todo, setTodo] = useState([]);
    const [getTodo, setGetTodo] = useState([]);

    const handleAdd = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/v1/user/todo', {
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

    useEffect( ()=>{
             fetch('http://localhost:3000/api/v1/user/todo',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                },
                credentials:"include",
            })
            .then((res)=>res.json())
            .then((data)=>{
                setGetTodo(data)
            })
            .catch((e)=>{console.error(e)})
    },[todo])
     console.log(getTodo)
    return (
        <>
            <div className="h-10 w-[fit]">
                <input placeholder="add todo" type="text" value={todo} onChange={(e:any)=>{setTodo(e.target.value)}}/>
                 <button onClick={handleAdd}>Add</button>
            </div>
            <div>
                {/* {getTodo} */}
            </div>
        </>
)
}