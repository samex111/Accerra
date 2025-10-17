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


  type Status = "notVisited" | "notAnswered" | "answered" | "review" | "answeredReview";
  const [answered, setAnswered] = useState(0);
  const [notAnswered, setNotAnswered] = useState(0);
  const [status, setStatus] = useState<Status[]>([]);

  function markForReview(qIndex: number) {
    setStatus((prev) => {
      const newStatus = [...prev];
      const current = newStatus[qIndex];
      if (current === "answered") {
        newStatus[qIndex] = "answeredReview";
      } else {
        newStatus[qIndex] = "review";
      }                                                              
      return newStatus;
    });
  }


  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const question = questions[index];


  // Answers object: { questionId: [selectedOptions] }
  const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
 const [remainingTime, setRemainingTime] = useState<number | null>(null);

  // Restore data on mount
  useEffect(() => {
    const saved = localStorage.getItem("userAnswers");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    const expiry = parsed.timestamp + 3 * 60 * 60 * 1000;

    if (Date.now() < expiry) {
      setAnswers(parsed.data);
      setRemainingTime(expiry - Date.now()); // set initial remaining time
    } else {
      localStorage.removeItem("userAnswers");
    }
  }, []);

  // Save answers whenever they change
  useEffect(() => {
    localStorage.setItem(
      "userAnswers",
      JSON.stringify({ data: answers, timestamp: Date.now() })
    );
    setRemainingTime(3 * 60 * 60 * 1000); // reset timer on every save
  }, []);

  // Countdown effect
  useEffect(() => {
    if (remainingTime === null) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev && prev > 1000 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  // Format milliseconds → hh:mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };
  let d = Date.now();
  let a = Math.floor(d/1000)
  console.log(a)

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/user/question?subject=` + props.subj, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.importQuestions)
        setStatus(Array(data.importQuestions.length).fill("notVisited"));

      })
      .catch((err) => console.error(err));

  }, [props.subj]);


  // handle option change
  const handleChange = (e: any, questionId: string, qIndex: number) => {
    const value = e.target.value;

    setAnswers((prev) => {
      const prevAns = prev[questionId] || [];
      let updated: string[];
      if (e.target.checked) {
        updated = [...prevAns, value];
      } else {
        updated = prevAns.filter((v) => v !== value);
      }
      setStatus((prev) => {
        const newStatus = [...prev];
        if (updated.length > 0) {
          newStatus[qIndex] = "answered";
          //  setAnswered((q)=>q+1)
          //  setNotAnswered((q)=>q-1)


        } else {
          newStatus[qIndex] = "notAnswered";

        }


        return newStatus;
      });

      // console.log("in the handleCHange: ",questionId)
      return { ...prev, [questionId]: updated };
    });
  };



  let correctCount = 0;
  const handleSubmit = async () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const selected = answers[q._id] || [];
      const isCorrect =
        q.answer.length === selected.length &&
        q.answer.every((ans) => selected.includes(ans));
      if (isCorrect) correctCount++;

      handleAttemtQuestion(
        q.question,
        selected,
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
  const [markedForReview, setMarkedForReview] = useState(0);
useEffect(() => {
  let answeredCount = 0;
  let notAnsweredCount = 0;
  let reviewCount = 0;

  for (let i = 0; i < status.length; i++) {
    if (status[i] === "answered") {
      answeredCount++;
    } 
    else if (status[i] === "notAnswered") {
      notAnsweredCount++;
    } 
    else if (status[i] === "review") {
      reviewCount++;
    }
  }

  setAnswered(answeredCount);
  setNotAnswered(notAnsweredCount);
  setMarkedForReview(reviewCount);

}, [status]); 




  // 
  return (
    <div className="w-full h-screen fixed ">
      <div className="flex justify-center gap-2 mt-2">

        <div className="w-1/2">
         <h1>Answers Auto-Save with Expiry</h1>
      {remainingTime !== null && remainingTime > 0 ? (
        <p>Expires in: {formatTime(remainingTime)}</p>
      ) : (
        <p>No saved answers or expired</p>
      )}
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

          <button className="py-2 px-4 border mx-2  " onClick={() => markForReview(index)}>Mark for review</button>

          <button className="border px-4 py-2 mx-2" onClick={handleSubmit}  >Submit test</button>
        </div>
        <div className="grid grid-cols-6 gap-2 w-[30vw] h-[30vh] bg-gray-100 p-3 rounded-sm overflow-y-scroll">
          {questions.map((_, i) => (
            <SquareBox
              key={i}
              num={i + 1}
              state={status[i]}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

      </div>
      <div>Ansewed: {answered} , Not answed:{notAnswered} , mark for review: {markedForReview}</div>
    </div>
  );



}
// https://www.upwork.com/jobs/~021968703455552133869
// https://www.upwork.com/jobs/~021963284564381569506
// https://www.upwork.com/jobs/~021958751092249657659

//  6:30 to 8:10 problem solve dsa + read more depth about core arrays linked stacks hashmap
//  3:00 to 4:30 understanding syntax mtlb reading more code + planning what feature to add
//  6:00 to 10:00 code building projects  