import { useEffect, useState } from "react";
import GeminiHint from "../component/geminiHint";
import SquareBox from "../component/QuestionSquareBox";

export default function Questions(props: any) {
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
  const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});

  // ⏰ 3 hours expiry check
  useEffect(() => {
    const savedData = localStorage.getItem("userAnswers");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const now = Date.now();

      if (now - parsed.timestamp < 3 * 60 * 60 * 1000) {
        setAnswers(parsed.data); // restore answers
      } else {
        localStorage.removeItem("userAnswers"); // expired
      }
    }
  }, []);


  // Save to localStorage whenever answers change
  useEffect(() => {
    localStorage.setItem(
      "userAnswers",
      JSON.stringify({ data: answers, timestamp: Date.now() })
    );
  }, [answers]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/user/question?subject=` + props.subj, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => setQuestions(data.importQuestions))
      .catch((err) => console.error(err));
  }, [props.subj]);



  // handle option change
  const handleChange = (e: any, questionId: string) => {
    const value = e.target.value;

    setAnswers((prev) => {
      const prevAns = prev[questionId] || [];
      let updated: string[];
      if (e.target.checked) {
        updated = [...prevAns, value];
      } else {
        updated = prevAns.filter((v) => v !== value);
      }
      // console.log("in the handleCHange: ",questionId)
      return { ...prev, [questionId]: updated };
    });
  };
     console.log(answers)

  // Submit function
  const handleSubmit = (question: Question) => {
    const selected = answers[question._id] || [];
    const isCorrect =
      question.answer.length === selected.length &&
      question.answer.every((ans) => selected.includes(ans));


    handleAttemtQuestion(
      question.question,
      selected,
      question.questionDiagram,
      question.answer,
      question.subject,
      isCorrect ? "solved" : "attempt",
      question.tags,
      "2m"
    );

    alert(isCorrect ? "congrats 🎉" : "wrong ❌");

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
            answer,
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
  const btn = document.getElementById(`${index+1}`);
  useEffect(()=>{
    for(let i=0; i<questions.length; i++){
      const q = questions[i];
      const userAns:any = answers[q._id];
      // const check = userAns[i];

      // console.log("user is any wala",userAns[q._id])
      console.log(`${i}`,userAns )
      if(userAns){
          

         btn?.setAttribute('style', 'background-color: blue; color: white;') 
         
      }
      // else if (userAns[index+1].removeItem){
      //  btn?.setAttribute('style', 'background-color: white; color: black;') 
      // }
      
    }
  },[answers])
  
  
  
  function submitAll() {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];              // current question
      const userAns = answers[q._id] || []; // user ka answer is question ke liye

      let isCorrect =
        q.answer.length === userAns.length &&
        q.answer.every((ans) => userAns.includes(ans));

      console.log("QID:", q._id, "User Ans:", userAns, "Correct Ans:", q.answer);
      console.log("✅ Correct?", isCorrect);

      if (isCorrect) {
        console.log("INSIDE if HEYY");
      } else {
        console.log("INSIDE else HEYY");
      }
    }
    console.log("All Answers Object:", answers);
  }

  // 
  return (
    <div className="w-full h-screen fixed ">
     <div className="flex justify-center gap-2 mt-2"> 
       
      <div className="w-1/2">
      <h1  className="text-2xl font-bold mb-1  ">Questions {index+1} <hr className="border-t-2 border-gray-400" /></h1>
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
    onChange={(e) => handleChange(e, question._id)}
    className="peer hidden"
  />
  <label
    htmlFor={`q-${question._id}-${i}`}
    className="flex items-center gap-3 w-full p-4 mb-3 text-gray-700 bg-white border-2 border-gray-200 rounded-lg cursor-pointer transition-colors  hover:bg-gray-50 dark:bg-white dark:text-black dark:border-gray-500 dark:hover:bg-gray-300 peer-checked:bg-blue-300 peer-checked:border-blue-300"
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

      <button className="border px-4 py-2 mx-2" onClick={submitAll}  >Submit test</button>
      </div>
 <div className="grid  grid-cols-9 grid- auto-cols-fr  w-[30vw] h-[30vh] bg-gray-500 p-3 rounded-sm">
  <SquareBox onClick={()=>{setIndex(0)}} num={1}   id = {1}></SquareBox>
  <SquareBox onClick={()=>{setIndex(1)}} num={2} id = {2}></SquareBox>
  <SquareBox  onClick={()=>{setIndex(2)}} num={3} id = {3}></SquareBox>
  <SquareBox onClick={()=>{setIndex(3)}} num={4} id = {4}></SquareBox>
  <SquareBox onClick={()=>{setIndex(4)}} num={5} id = {5}></SquareBox>
  <SquareBox  onClick={()=>{setIndex(5)}}  num={6} id = {6}></SquareBox>
  <SquareBox  onClick={()=>{setIndex(6)}}  num={7} id = {7}></SquareBox>
   <SquareBox  onClick={()=>{setIndex(7)}} num={8} id = {8}></SquareBox>
   <SquareBox onClick={()=>{setIndex(8)}} num={9} id = {9}></SquareBox>
   <SquareBox onClick={()=>{setIndex(9)}} num={10} id = {10}></SquareBox>
  <SquareBox  onClick={()=>{setIndex(10)}} num={11} id = {11}></SquareBox>
  <SquareBox  onClick={()=>{setIndex(11)}} num={12} id = {12}></SquareBox>
  <SquareBox onClick={()=>{setIndex(12)}} num={13} id = {13}></SquareBox>
  <SquareBox onClick={()=>{setIndex(13)}} num={14} id = {14}></SquareBox>
  <SquareBox onClick={()=>{setIndex(14)}} num={15} id = {15}></SquareBox>
  <SquareBox onClick={()=>{setIndex(15)}} num={16} id = {16}></SquareBox>
  <SquareBox onClick={()=>{setIndex(16)}} num={17} id = {17}></SquareBox>
  <SquareBox onClick={()=>{setIndex(17)}} num={18} id = {18}></SquareBox>
  <SquareBox onClick={()=>{setIndex(18)}} num={19} id = {19}></SquareBox>
  <SquareBox onClick={()=>{setIndex(19)}} num={20} id = {20}></SquareBox>
  <SquareBox onClick={()=>{setIndex(20)}} num={21} id = {21}></SquareBox>
  <SquareBox onClick={()=>{setIndex(21)}} num={22} id = {22}></SquareBox>
  <SquareBox onClick={()=>{setIndex(22)}} num={23} id = {23}></SquareBox>
  <SquareBox onClick={()=>{setIndex(23)}} num={24} id = {24}></SquareBox>
  <SquareBox onClick={()=>{setIndex(24)}} num={25} id = {25}></SquareBox>
  <SquareBox onClick={()=>{setIndex(25)}} num={26} id = {26}></SquareBox>
  <SquareBox onClick={()=>{setIndex(26)}} num={27} id = {27}></SquareBox>
  <SquareBox onClick={()=>{setIndex(27)}} num={28} id = {28}></SquareBox>
  <SquareBox onClick={()=>{setIndex(28)}} num={29} id = {29}></SquareBox>
  <SquareBox onClick={()=>{setIndex(29)}} num={30} id = {30}></SquareBox>
  <SquareBox onClick={()=>{setIndex(30)}} num={31} id = {31}></SquareBox>
  <SquareBox onClick={()=>{setIndex(31)}} num={32} id = {32}></SquareBox>  
  <SquareBox onClick={()=>{setIndex(32)}} num={33} id = {33}></SquareBox>
  <SquareBox onClick={()=>{setIndex(33)}} num={34} id = {34}></SquareBox>
  <SquareBox onClick={()=>{setIndex(34)}} num={35} id = {35}></SquareBox>
  <SquareBox onClick={()=>{setIndex(35)}} num={36} id = {36}></SquareBox>
  <SquareBox onClick={()=>{setIndex(36)}} num={37} id = {37}></SquareBox>
  </div>
    </div>
    </div>
  );
}
// https://www.upwork.com/jobs/~021968703455552133869
// https://www.upwork.com/jobs/~021963284564381569506
// https://www.upwork.com/jobs/~021958751092249657659

//  6:30 to 8:10 problem solve dsa + read more depth about core arrays linked stacks hashmap
//  3:00 to 4:30 understanding syntax mtlb reading more code + planning what feature to add
//  6:00 to 10:00 code building projects  