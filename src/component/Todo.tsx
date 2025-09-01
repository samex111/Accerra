import { useState } from "react";

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
            const data = res.json();
            console.log(data);
        } catch (e) {
            console.log(e)
        }
    }
    
    return (
        <>
            <div>
                <input type="text" value={todo} onChange={(e:any)=>{setTodo(e.target.value)}}/>
                 <button onClick={handleAdd}>Add</button>
            </div>
        </>
)
}