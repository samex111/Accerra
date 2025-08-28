import { useEffect, useState } from "react";
import GeminiHint from "../component/geminiHint";

export default function Questions() {

  interface Question {
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
    fetch("http://localhost:3000/api/v1/user/preview", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"

      }
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.showQuestions);  // 👈 andar se nikal liya
      })
      .catch((err) => console.error(err));
  }, []);
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (e: any) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelected([...selected, value]);
    } else {
      setSelected(selected.filter((v) => v !== value));
    }
  }
  console.log(selected)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions Bank</h1>

      {questions.map((q) => (
        <div key={q._id} className="border p-3 mb-4 rounded shadow">
          <div>
          <p className="font-semibold">{q.question}</p>
           {/* <button className="border px-5 py-1">hint</button> */}
           <div><GeminiHint prompt={q.question+ " ans in 5-6 words"}></GeminiHint></div>
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
                return alert("congrats 🎉");
              } else {
                console.log("Selected:", selected);
                return alert("wrong ❌");
              }
            }}

          >Submit</button>
        </div>
      ))}

    </div>
  );
}

