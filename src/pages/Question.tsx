import { useEffect, useState } from "react";
import GeminiHint from "../component/geminiHint";



export default function Questions() {

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

  const [selectedSubject, setSelectedSubject] = useState('');

  const handleMaths = () =>{
    setSelectedSubject("MATHS");
  }
  const handlePhysics = () =>{
    setSelectedSubject("PHYSICS");
  }
  const handleChemistry = () =>{
    setSelectedSubject("CHEMISTRY");
  }
 
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/user/question?subject=`+selectedSubject, {
      method: "GET",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"

      }
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.showQuestions);  
      })
      .catch((err) => console.error(err));
  }, [selectedSubject]);
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
  return (
    <>
    <div>
      <button onClick={handleMaths}>Maths</button>
    </div>
    <div>
      <button onClick={handlePhysics}>Physics</button>
    </div>
    <div>
      <button onClick={handleChemistry}>Chemistry</button>
    </div>
    { selectedSubject &&
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions Bank + {selectedSubject}</h1>

      {questions.map((q) => (
        <div key={q._id} className="border p-3 mb-4 rounded shadow">
          <div>
          <p className="font-semibold">{q.question}</p>
           {/* <button className="border px-5 py-1">hint</button> */}
           <div><GeminiHint prompt={q.question+ " ans in 5-6 words" + q.questionDiagram}></GeminiHint></div>
          </div>
          <div>
            <img src={q.questionDiagram} alt="" />
          </div>
          
          <div className="mt-2">
            {q.option.map((opt, i) => (
              <label key={i} className="block">
                <input type="checkbox" name={`q-${q._id}`} value={opt} onChange={handleChange} /> {opt}

              </label>

            ))}
          </div>

          <div className="text-sm text-gray-600 mt-2">
            Subject: {q.subject} | Year: {q.year} | Exam: {q.examType.join(", ")} |
            Difficulty: {q.difficulty.join(", ")} |Answer:  {q.answer}
          </div>

          <div className="mt-1 text-xs text-blue-500">
            Tags: {q.tags.join(", ")}   
          </div>
          < button className="px-4 py-2 m-2 border-[4px] hover:border-red-700"
            onClick={() => {
              
              const isCorrect =
                q.answer.length === selected.length &&
                q.answer.every((ans) => selected.includes(ans));

              if (isCorrect) {
                console.log("Selected:", selected);
                handleAttemtQuestion(q.question,selected,q.questionDiagram, q.answer , q.subject ,"solved" ,q.tags , "2m"  );
                return alert("congrats ");
              } else {
                console.log("Selected:", selected);
                 handleAttemtQuestion(q.question, selected,q.questionDiagram, q.answer, q.subject, "attempt", q.tags,"2m");
                return alert("wrong ");
               
              }
               
            }}

          >Submit</button>
        </div>
      ))}

    </div>
}
    </>
  );
}
