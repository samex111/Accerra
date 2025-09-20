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
  const question = questions[index];


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
    <div className="h-[50vh] p-4 ">
      <h1 className="text-2xl font-bold mb-4">Questions Bank + {props.subj}</h1>

      {question && (
        <div key={question._id} className="border p-3 mb-4 rounded shadow">
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
              <label key={i} className="block">
                <input
                  type="checkbox"
                  name={`q-${question._id}`}
                  value={opt}
                  checked={answers[question._id]?.includes(opt) || false}
                  onChange={(e) => handleChange(e, question._id)}
                />{" "}
                {opt}
              </label>
            ))}
          </div>

          <button
            className="px-4 py-2 m-2 border-[4px] hover:border-red-700"
            onClick={() => handleSubmit(question)}
          >
            Submit
          </button>
        </div>
      )}

      <button
        disabled={index === 0}
        onClick={() => index > 0 && setIndex(index - 1)}
        className="border py-2 px-4 mr-1 "
      >
        Previous
      </button>
      <button
        disabled={index === questions.length - 1}
        onClick={() => index < questions.length - 1 && setIndex(index + 1)}
        className="py-2 px-4 border"
      >
        Next
      </button>

      <button onClick={submitAll}  >Submit test</button>
 <div className="grid grid-cols-9 gap-2 w-[30vw] bg-gray-500 p-3 rounded-sm">
  <SquareBox num={0} ID = {0}></SquareBox>
  <div onClick={()=>{setIndex(1)}}><SquareBox num={1} ID = {1}></SquareBox></div>
  <SquareBox num={2} ID = {2}></SquareBox>
  <SquareBox num={3} ID = {3}></SquareBox>
  <SquareBox num={4} ID = {4}></SquareBox>
  <SquareBox num={5} ID = {5}></SquareBox>
  <SquareBox num={6} ID = {6}></SquareBox>
  <SquareBox num={7} ID = {7}></SquareBox>
  <SquareBox num={8} ID = {8}></SquareBox>
  <SquareBox num={9} ID = {9}></SquareBox>
  <SquareBox num={10} ID = {10}></SquareBox>
  <SquareBox num={11} ID = {11}></SquareBox>
  <SquareBox num={12} ID = {12}></SquareBox>
  <SquareBox num={13} ID = {13}></SquareBox>
  <SquareBox num={14} ID = {14}></SquareBox>
  <SquareBox num={15} ID = {15}></SquareBox>
  <SquareBox num={16} ID = {16}></SquareBox>
  <SquareBox num={17} ID = {17}></SquareBox>
  <SquareBox num={18} ID = {18}></SquareBox>
  <SquareBox num={19} ID = {19}></SquareBox>
  <SquareBox num={20} ID = {20}></SquareBox>
  <SquareBox num={21} ID = {21}></SquareBox>
  <SquareBox num={22} ID = {22}></SquareBox>
  <SquareBox num={23} ID = {23}></SquareBox>
  <SquareBox num={24} ID = {24}></SquareBox>
  <SquareBox num={25} ID = {25}></SquareBox>
  <SquareBox num={26} ID = {26}></SquareBox>
  <SquareBox num={27} ID = {27}></SquareBox>
  <SquareBox num={28} ID = {28}></SquareBox>
  <SquareBox num={29} ID = {29}></SquareBox>
  <SquareBox num={30} ID = {30}></SquareBox>
  <SquareBox num={31} ID = {31}></SquareBox>
  <SquareBox num={32} ID = {32}></SquareBox>  
  <SquareBox num={33} ID = {33}></SquareBox>
  <SquareBox num={34} ID = {34}></SquareBox>
  <SquareBox num={35} ID = {35}></SquareBox>
  <SquareBox num={36} ID = {36}></SquareBox>
  <SquareBox num={37} ID = {37}></SquareBox>
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