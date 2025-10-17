import { useEffect, useState } from "react";
import GeminiHint from "../component/geminiHint";
import SquareBox from "../component/QuestionSquareBox";

export default function PracticeQuestion(props: any) {
  interface Question {
    questionDiagram: string;
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
  const [index, setIndex] = useState(0);
  const question = questions[index];


  // Answers object: { questionId: [selectedOptions] }

  const [selected,setSelected] = useState<string[]>([]);




  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/user/question?subject=` + props.subj, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.importQuestions)
       
      })
      .catch((err) => console.error(err));

  }, [props.subj]);


  // handle option change
  const handleChange = (e: any, questionId: string, qIndex: number) => {
    const value = e.target.value;
   
        
    //  }
    if(e.target.checked){
      setSelected([...selected,value])
    }else{
      const updateItems =  selected.filter((v)=>v!==value);
      console.log("updated Item: ", updateItems)
      setSelected(updateItems);
    
    }
    

   

  };
  useEffect(()=>{
    setSelected([])
  },[index])
         console.log("Selected: ",selected)    
        
   


  let correctCount = 0;
  const handleSubmit = async () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const selected1 = selected || [];
      const isCorrect =
        q.answer.length === selected1.length &&
        q.answer.every((ans) => selected1.includes(ans));
      if (isCorrect) correctCount++;

       handleAttemtQuestion(
        q.question,
        selected1,
        q.questionDiagram,
        q.answer,
        q.subject,
        isCorrect ? "solved" : "attempt",
        q.tags,
        "2m"
      );

    }
    alert(`you got ${correctCount} out of ${questions.length}  correct!`)


    // 🗑️ Clear localStorage after submit
    localStorage.removeItem("userAnswers");
  };

  async function handleAttemtQuestion(
    question: string,
    userAnswer: string[],
    questionDiagram: string,
    answer: string[],
    subject: string,
    status: string,
    tags: string[],
    timetaken: string
  ) {
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/user/attempt/question",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            questionDiagram,
            userAnswer,
            selected,
            subject,
            status,
            tags,
            timetaken
          })
        }
      );
      const data = res.json();
      console.log("Data is :   ", data);
    } catch (e) {
      console.log(e);
    }
  }


  // 
  return (
    <div className="w-full h-screen fixed ">
      <div className="flex justify-center gap-2 mt-2">

        <div className="w-1/2">
     
          <h1 className="text-2xl font-bold mb-1  ">Questions {index + 1} <hr className="border-t-2 border-gray-400" /></h1>
          <div className="h-96  overflow-y-scroll">
            {question && (
              <div key={question._id} className=" p-3 mb-4 ">
                <p className="font-semibold">{question.question}</p>
                {props.mode === "practice" && (
                  <GeminiHint
                    prompt={
                      question.question +
                      " hint with formula in 5-8 words" +
                      question.questionDiagram
                    }
                  />
                )}
                <img src={question.questionDiagram} alt="" />

                <div className="mt-2">
                  {question.option.map((opt, i) => (
                    <div
                      key={i}
                      className="w-full"
                    >
                      <input
                        type="checkbox"
                        id={`q-${question._id}-${i}`}
                        name={`q-${question._id}`}
                        value={opt}
                        checked={answers[question._id]?.includes(opt) || false}
                        onChange={(e) => handleChange(e, question._id, index)}
                        className="peer hidden"
                      />
                      <label
                        htmlFor={`q-${question._id}-${i}`}
                        className="flex items-center gap-3 w-full p-4 mb-3 text-gray-700 bg-white border-2 border-gray-200  rounded-lg cursor-pointer transition-colors  hover:bg-gray-50 dark:bg-white dark:text-black dark:border-gray-500 dark:hover:bg-gray-300 peer-checked:bg-blue-300 peer-checked:border-blue-300"
                      >
                        <span className="peer-checked:text-blue-600">{opt}</span>
                      </label>
                    </div>
                  ))}

                </div>

                {/* <button
            className="px-4 py-2 m-2 border-[4px] hover:border-red-700"
            onClick={() => handleSubmit(question)}
          >
            Submit
          </button> */}
              </div>
            )}  
          </div>
          <hr className="border-t-2 border-gray-400"></hr>
          <button
            disabled={index === 0}
            onClick={() => index > 0 && setIndex(index - 1)}
            className="border py-2 px-4 mr-1 mt-1"
          >
            Previous
          </button>
          <button
            disabled={index === questions.length - 1}
            onClick={() => index < questions.length - 1 && setIndex(index + 1)}
            className="py-2 px-4 border mx-2  "
          >
            Next
          </button>


          <button className="border px-4 py-2 mx-2" onClick={handleSubmit}  >Submit test</button>
        </div>
      

      </div>
    </div>
  );



}
