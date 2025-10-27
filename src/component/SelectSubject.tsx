import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SelectSubject(){
 const navigate = useNavigate();

  return(
    <>
    <div className="mr-[2vw]">
      <div>
      <Button size = "lg" variant={'outline'} className="mb-1 w-[5vw] h-[6vh] lg:w-[10vw] lg-h[8vh]" onClick={()=>{ return navigate('/questions/maths')}}>Maths</Button>
    </div>
    <div>
      <Button size = "lg" variant={'outline'} className="mb-1 " onClick={()=>{ return navigate('/questions/physics')}}>Physics</Button>
    </div>
    <div>
      <Button size = "lg" variant={'outline'} className="mb-1 "  onClick={()=>{ return navigate('/questions/chemistry')}}>Chemistry</Button>
    </div>
    </div>
    </>
  )
}
