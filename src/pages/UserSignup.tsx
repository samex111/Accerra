import { useState } from "react";

export default function SignUp(){
    const [email , setEmail]= useState('');
    const [password , setPassword] = useState('');
    const [username , setUsername] = useState('');

    const handleSignup = async () => {
        try{
            const res = await fetch('http://localhost:3000/api/v1/user/signup', {
                method :"POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body: JSON.stringify({email,username,password})
            });

            const data = await res.json();
            console.log(data);

            if(res.ok){
                alert('Signup successful');
            }   
            else{
                alert(data.msg || "signup failed")
            }
        }catch(e){
            console.log(e);
            alert('Error during signup')
        }
    }
    
    return(
        <>
        <div className="flex justify-center text-4xl">Register</div>
        <div>
            <label htmlFor="email">Email</label>
            <input  className="border-2" type="text" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <br />
            <label htmlFor="password">Password</label>
            <input  className="border-2" type="text" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <br />
            <label htmlFor="username">Username</label>
            <input  className="border-2" type="text" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <button className="text-xl px-4 py-1 border-[4px] " onClick={handleSignup}>register</button>

        </div>
        </>
    )
}