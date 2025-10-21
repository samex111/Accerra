import { useNavigate } from "react-router-dom";


export default function SelectSubject(){
 const navigate = useNavigate();

  return(
    <>
    <div className="mr-[2vw]">
      <div>
      <button className="border   mt-2 p-3 mb-4 rounded shadow" onClick={()=>{ return navigate('/questions/maths')}}>Maths</button>
    </div>
    <div>
      <button className="border  mt-2 p-3 mb-4 rounded shadow"onClick={()=>{ return navigate('/questions/physics')}}>Physics</button>
    </div>
    <div>
      <button className="border mt-2 p-3 mb-4 rounded shadow"onClick={()=>{ return navigate('/questions/chemistry')}}>Chemistry</button>
    </div>
    </div>
    </>
  )
}
