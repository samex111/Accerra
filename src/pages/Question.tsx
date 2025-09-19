import { useEffect, useState } from "react";
import GeminiHint from "../component/geminiHint";

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
      return { ...prev, [questionId]: updated };
    });
  };
  console.log("Ans: ",answers)

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
    </div>
  );
}
// https://www.upwork.com/jobs/~021968703455552133869
// https://www.upwork.com/jobs/~021963284564381569506
//https://www.upwork.com/jobs/~021958751092249657659