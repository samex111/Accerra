import { useEffect, useState } from "react";
import GeminiHint from "../component/geminiHint";
import SquareBox from "../component/QuestionSquareBox";
import { Bookmark, BookmarkMinus, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmarkStore } from "@/hooks/useBookmarkStore";
import { API_URL } from "@/config/env";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";


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
  const {
    bookmarks,
    bookmarkQuestions,
    fetchBookmarks,
    fetchBookmarkQuestion,
    removeBookmark,addBookmark
  } = useBookmarkStore();

    useEffect(() => {
    const loadData = async () => {
      await fetchBookmarks();             // Fetch only IDs first
      await fetchBookmarkQuestion();      // Then fetch full question details
    };
    loadData();
  }, []); // only run once


  type Status = "notVisited" | "notAnswered" | "answered" | "review" | "answeredReview";
  const [answered, setAnswered] = useState(0);
  const [notAnswered, setNotAnswered] = useState(0);
  const [status, setStatus] = useState<Status[]>([]);
  const [isBookmark , setIsBookmark] = useState(false);

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
  // console.log(a)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/user/questions`, {
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
        `${API_URL}/api/v1/user/attempt/question`,
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
  const id = localStorage.getItem('StudentID');
 
  
  // 
 return (
  <div className="w-full h-full">

    {/* Top mobile bar */}
    <div className="flex items-center justify-between px-4 py-2 md:hidden border-b">
      <div>
        <h1 className="text-sm font-semibold">Questions {index + 1}</h1>
        {remainingTime !== null && remainingTime > 0 && (
          <p className="text-xs text-gray-500">
            Expires in: {formatTime(remainingTime)}
          </p>
        )}
      </div>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[85vw]">
          <SheetHeader>
            <SheetTitle>Questions</SheetTitle>
          </SheetHeader>

          <div className="mt-4 grid grid-cols-5 gap-2 overflow-y-auto">
            {questions.map((_, i) => (
              <SquareBox
                key={i}
                num={i + 1}
                state={status[i]}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <div className="mt-4 text-sm">
            Answered: {answered} <br />
            Not answered: {notAnswered} <br />
            Marked: {markedForReview}
          </div>
        </SheetContent>
      </Sheet>
    </div>

    {/* Main Layout */}
    <div className="flex justify-center gap-4 px-2 md:px-4">

      {/* LEFT — QUESTION */}
      <div className="w-full md:w-1/2">

        {/* Desktop Header */}
        <div className="hidden md:block">
          <h1>Answers Auto-Save with Expiry</h1>
          {remainingTime !== null && remainingTime > 0 ? (
            <p>Expires in: {formatTime(remainingTime)}</p>
          ) : (
            <p>No saved answers or expired</p>
          )}

          <div className="flex justify-around items-center">
            <h1 className="text-2xl font-bold">
              Questions {index + 1}
            </h1>

            {bookmarks.includes(question?._id) ? (
              <Bookmark fill="" onClick={() => removeBookmark(question?._id)} />
            ) : (
              <Bookmark onClick={() => addBookmark(question?._id)} />
            )}
          </div>
          <hr className="border-t-2 border-gray-400" />
        </div>

        {/* Question Body */}
        <div className="h-[60vh] md:h-96 overflow-y-auto">
          {question && (
            <div key={question._id} className="p-3 space-y-3">
              <p className="font-semibold">{question.question}</p>

              {props.mode === "practice" && (
                <GeminiHint
                  prompt={`${question.question} hint with formula in 5-8 words`}
                />
              )}

              {question.questionDiagram && (
                <img
                  src={question.questionDiagram}
                  className="max-h-60 mx-auto"
                />
              )}

              {/* Options */}
              <div className="mt-2">
                {question.option.map((opt, i) => (
                  <div key={i}>
                    <input
                      type="checkbox"
                      id={`q-${question._id}-${i}`}
                      value={opt}
                      checked={answers[question._id]?.includes(opt) || false}
                      onChange={(e) =>
                        handleChange(e, question._id, index)
                      }
                      className="peer hidden"
                    />

                    <label
                      htmlFor={`q-${question._id}-${i}`}
                      className="flex items-center gap-3 w-full p-4 mb-3 border-2 rounded-lg cursor-pointer
                      peer-checked:bg-blue-300 peer-checked:border-blue-300"
                    >
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
            className="border px-4 py-2"
          >
            Previous
          </button>

          <button
            disabled={index === questions.length - 1}
            onClick={() => setIndex(index + 1)}
            className="border px-4 py-2"
          >
            Next
          </button>

          <button
            className="border px-4 py-2"
            onClick={() => markForReview(index)}
          >
            Mark for review
          </button>

          <button
            className="border px-4 py-2"
            onClick={handleSubmit}
          >
            Submit test
          </button>
        </div>
      </div>

      {/* RIGHT — QUESTION BOXES (DESKTOP ONLY) */}
      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-2 w-[30vw] h-[30vh] bg-gray-100 p-3 overflow-y-auto">
          {questions.map((_, i) => (
            <SquareBox
              key={i}
              num={i + 1}
              state={status[i]}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <div className="mt-2 text-sm">
          Answered: {answered}, Not answered: {notAnswered},
          Marked: {markedForReview}
        </div>
      </div>
    </div>
  </div>
);



}

// Bookmark :  
// (9) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// 0
// : 
// {_id: '68ada3b0c4e4c8ff1c8a4e69'}
// 1
// : 
// {_id: '68bbc68a1c78202b646a1e0a'}
// 2
// : 
// {_id: '68bf0bb4ce60f4fea1ede7b5'}
// 3
// : 
// {_id: '68c0453477d080bc119d9a3e'}
// 4
// : 
// {_id: '68c045ea77d080bc119d9a40'}
// 5
// : 
// {_id: '68c046f577d080bc119d9a44'}
// 6
// : 
// {_id: '68c047aa77d080bc119d9a46'}
// 7
// : 
// {_id: '68c0487e77d080bc119d9a48'}
// 8
// : 
// {_id: '68c048e777d080bc119d9a4a'}
// length
// : 
// 9
// [[Prototype]]
// : 
// Array(0)

// {
//   "response": {
//     "_id": "68ada3b0c4e4c8ff1c8a4e69",
//     "question": "what is 7*7",
//     "option": [
//       "49",
//       "12",
//       "122",
//       "42"
//     ],
//     "answer": [
//       "49"
//     ],
//     "subject": "MATHS",
//     "year": 2007,
//     "examType": [
//       "JEE"
//     ],
//     "difficulty": [
//       "EASY"
//     ],
//     "tags": [
//       "multification"
//     ],
//     "createdAt": "2025-08-26T12:08:16.581Z",
//     "updatedAt": "2025-08-26T12:08:16.581Z",
//     "__v": 0,
//     "embedding": [-0.013974297, -0.043944329, -0.003779212, 0.035331242, -0.056248743, -0.004438377, 0.044823218, -0.048866093, -0.009667752, 0.027421262, 0.008700977, -0.024433047, -0.001527065, -0.01907184, 0.001027199, 0.046756767, 0.017577732, 0.046405211, 0.066443823, -0.056248743, -0.00507557, 0.046756767, -0.004811904, -0.018720284, -0.08507622, 0.018808173, 0.033573467, -0.006064318, -0.007778146, -0.012304412, -0.003647379, -0.049217649, 0.009975363, -0.047459874, -0.037089013, 0.006547705, -0.088591769, 0.030585254, 0.034803908, 0.038143679, -0.001516079, -0.011601303, -0.022851052, -0.014589517, 0.039198343, 0.052381642, 0.018280841, 0.015116849, -0.03287036, -0.061522063, -0.043241221, 0.015380516, 0.025311934, 0.004724015, -0.017226176, 0.020565946, -0.032694582, -0.041131891, -0.016698845, -0.028300148, -0.004724015, 0.006415872, -0.007031093, -0.00031173, 0.003933018, -0.041835003, 0.0085252, 0.007646313, -0.011601303, 0.025487712, -0.012392301, -0.0217085, 0.012831745, 0.011952857, -0.041307669, 0.012568078, 0.018456619, 0.020038614, 0.049217649, 0.001779745, 0.008393367, 0.044120107, -0.001702843, -0.050272312, -0.010282973, -0.001955523, -0.007338703, 0.018544506, 0.007997868, 0.015819959, -0.030936807, 0.00953592, -0.038495231, 0.051326979, 0.024433047, -0.010942138, 0.008261534, -0.073123366, -0.062576726, 0.02232372, 0.019774949, -0.007382648, 0.040780339, -0.018544506, 0.062576726, 0.000051497, 0.00325188, -0.027948594, 0.005471069, 0.012304412, -0.000059394, -0.01511