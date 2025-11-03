import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SelectSubject(){
 const navigate = useNavigate();
   const buttonSize  =  "w-[10rem] h-[3rem] mb-1 "
  return(
    <>
    <div className="mr-[2vw]">
      <div>
      <Button size = "lg" variant={'outline'} className={buttonSize} onClick={()=>{ return navigate('/questions/maths')}}>Maths</Button>
    </div>
    <div>
      <Button size = "lg" variant={'outline'} className={buttonSize} onClick={()=>{ return navigate('/questions/physics')}}>Physics</Button>
    </div>
    <div>
      <Button size = "lg" variant={'outline'} className={buttonSize}  onClick={()=>{ return navigate('/questions/chemistry')}}>Chemistry</Button>
    </div>
    <div>
      <Button size = "lg" variant={'outline'} className={buttonSize}  onClick={()=>{ return navigate('/questions/test')}}>test</Button>
    </div>
    </div>
    </>
  )
}
