import { useNavigate } from "react-router-dom";


export default function SelectSubject(){
 const navigate = useNavigate();

  return(
    <>
      <div>
      <button className="border w-1/2 mt-2 p-3 mb-4 rounded shadow" onClick={()=>{ return navigate('/questions/maths')}}>Maths</button>
    </div>
    <div>
      <button className="border w-1/2 mt-2 p-3 mb-4 rounded shadow"onClick={()=>{ return navigate('/questions/physics')}}>Physics</button>
    </div>
    <div>
      <button className="border w-1/2 mt-2 p-3 mb-4 rounded shadow"onClick={()=>{ return navigate('/questions/chemistry')}}>Chemistry</button>
    </div>
    </>
  )
}
