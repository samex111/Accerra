import { useEffect, useRef, useState } from "react";
import GeminiHint from "../component/geminiHint";


export default function Questions(props:any) {

  interface Question {
    questionDiagram: string ;
    _id: string;
    question: string;
    option: string[];
    answer: string[];
    subject: string;
    year: number;
    examType: string[];
    difficulty: string[];
    tags: string[];
  }
  const [questions, setQuestions] = useState<Question[]>([]);

  
 
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/user/question?subject=`+props.subj, {
      method: "GET",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"

      }
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.importQuestions);  
      })
      .catch((err) => console.error(err));
  }, [props.subj]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (e: any) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelected([...selected, value]);
    } else {
      setSelected(selected.filter((v) => v !== value));
    }
  }



  async function handleAttemtQuestion(question : string,userAnswer:string[],questionDiagram:string, answer : string[],subject:string,status:string,tags:string[] , timetaken:string){
  try{
    const res = await fetch('http://localhost:3000/api/v1/user/attempt/question', {
      method:'POST',
      credentials : "include",
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({question,questionDiagram, userAnswer,answer,subject,status,tags,timetaken})
    })
    const data = res.json();
    console.log("Data is :   ", data);

    if(res.ok){
      alert("question atttempt");
    }
    else{
      console.log("Data is :   ", data);
      alert(res.ok + "inside else");
    }

  }catch(e){
    console.log(e +  "nhi ho rha kya ,, inside catch")
  }
  }

  const [index,setIndex] = useState(0);
  const question = questions[index];
  
  return (
    <>
  
     
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions Bank + {props.subj}</h1>

     
        <div key={question?._id} className="border p-3 mb-4 rounded shadow">
          <div>
          <p className="font-semibold">{question?.question}</p>
           {/* <button className="border px-5 py-1">hint</button> */}
          {props.mode === "practice"&& <div><GeminiHint prompt={question?.question+ " hint in 5-6 words with formula if needed" + question?.questionDiagram}></GeminiHint></div>}
          </div>
          <div>
            <img src={question?.questionDiagram} alt="" />
          </div>
          
          <div className="mt-2">
            {question?.option.map((opt, i) => (
              <label key={i} className="block">
                <input type="checkbox" name={`q-${question?._id}`} value={opt} onChange={handleChange} /> {opt}

              </label>

            ))}
          </div>

          <div className="text-sm text-gray-600 mt-2">
            Subject: {question?.subject} | Year: {question?.year} | Exam: {question?.examType.join(", ")} |
            Difficulty: {question?.difficulty.join(", ")} |Answer:  {question?.answer}
          </div>

          <div className="mt-1 text-xs text-blue-500">
            Tags: {question?.tags.join(", ")}   
          </div>
          < button className="px-4 py-2 m-2 border-[4px] hover:border-red-700"
            onClick={() => {
              
              const isCorrect =
                question?.answer.length === selected.length &&
                question?.answer.every((ans) => selected.includes(ans));

              if (isCorrect) {
                console.log("Selected:", selected);
                handleAttemtQuestion(question?.question,selected,question?.questionDiagram, question?.answer , question?.subject ,"solved" ,question?.tags , "2m"  );
                return alert("congrats ");
              } else {
                console.log("Selected:", selected);
                 handleAttemtQuestion(question?.question, selected,question?.questionDiagram, question?.answer, question?.subject, "attempt", question?.tags,"2m");
                return alert("wrong ");
               
              }
               
            }}

          >Submit</button>
        </div>
      <button  disabled={index===0} onClick={()=>{if(index>0){setIndex(index-1)} }} className="border py-2 px-4 mr-1 ">previous </button>

      <button disabled={index === questions.length - 1}  onClick={()=>{if(index < questions.length-1){setIndex(index+1)}}} className="py-2 px-4  border">Next</button>
    </div>

    </>
  );
}
