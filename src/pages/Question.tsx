import { useEffect, useState } from "react";

export default function Questions() {
    // src/pages/Question.tsx

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
  fetch("http://localhost:3000/api/v1/questions/preview")
    .then((res) => res.json())
    .then((data) => {
      setQuestions(data.showQuestions);  // 👈 yaha se andar se nikalna hai
    })
    .catch((err) => console.error(err));
}, []);


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions Bank</h1>

      {questions.map((q) => (
        <div key={q._id} className="border p-3 mb-4 rounded shadow">
          <p className="font-semibold">{q.question}</p>
          
          <div className="mt-2">
            {q.option.map((opt, i) => (
              <label key={i} className="block">
                <input type="radio" name={`q-${q._id}`} value={opt} /> {opt}
              </label>
            ))}
          </div>

          <div className="text-sm text-gray-600 mt-2">
            Subject: {q.subject} | Year: {q.year} | Exam: {q.examType.join(", ")} | 
            Difficulty: {q.difficulty.join(", ")}
          </div>

          <div className="mt-1 text-xs text-blue-500">
            Tags: {q.tags.join(", ")}
          </div>
        </div>
      ))}
      
    </div>
  );
}

