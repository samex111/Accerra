import { useState } from "react";

export default function Signin() {
    const [identifire, setIdentifire] = useState('');
    const [password, setPassword] = useState('');
const handleSignIn = async () => {
        try{
            const res = await fetch('http://localhost:3000/api/v1/user/signin', {
                method :"POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body: JSON.stringify({identifire,password})
            });

            const data = await res.json();
            console.log(data);

            if(res.ok){
                alert('Signin successful');
            }   
            else{
                alert(data.msg || "signin failed")
            }
        }catch(e){
            console.log(e);
            alert('Error during signin')
        }
    }
    
 return(
    <>
        <div className="flex justify-center text-4xl">Login</div>
<div>
        <label htmlFor="identy">Type email or username</label>
        <input className="border-2" type="text" id="identy" value={identifire} onChange={(e) => setIdentifire(e.target.value)} />
        <br />

        <label htmlFor="pass">Type password</label>
        <input className="border-2" type="text" id="pass" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="text-xl px-4 py-1 border-[4px] " onClick={handleSignIn}>submit</button>

    </>
 )
}