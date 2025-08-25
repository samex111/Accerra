import { useState } from "react";

// Option type
type OptionType = {
  id: number;
  text: string;
};

// Props for OptionGroup
type OptionProps = {
  options: OptionType[];
  setOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
  selectedOptions: number[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<number[]>>;
  title: string;
  type: "checkbox" | "radio";
};

export default function AddQuestion() {
  // Main form states
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<OptionType[]>([{ id: 1, text: "Example Option" }]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [subject, setSubject] = useState<"MATHS" | "PHYSICS" | "BIO" | "CHEMISTRY" | "">("");
  const [year, setYear] = useState<number>(2025);
  const [examType, setExamType] = useState<"JEE" | "NEET" | "">("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Add new tag
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag("");
    }
  };

  // Delete tag
  const handleDeleteTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Submit form
  const handleAddQuestion = async () => {
    if (!question.trim()) return alert("Question cannot be empty.");
    if (options.length === 0) return alert("Add at least one option.");
    if (!examType) return alert("Select exam type.");
    if (!difficulty) return alert("Select difficulty.");
    if (selectedOptions.length === 0) return alert("Select correct answer(s).");

    // Prepare answer based on selected options
  const answer = selectedOptions
  .map((id) => options.find((o) => o.id === id)?.text)
  .filter(Boolean); // null/undefined hata dega

    const payload = {
      question,
       option: options.map(o => o.text),
      answer,
      subject,
      year,
      examType,
      difficulty,
      tags,
    };

    try {
      const res = await fetch("http://localhost:3000/api/v1/admin/add/question", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
          
      });

      const data = await res.json();
      if (res.ok) {
        alert("Question added successfully!");
        // Reset form
        setQuestion("");
        setOptions([{ id: 1, text: "Example Option" }]);
        setSelectedOptions([]);
        setSubject("MATHS");
        setYear(2025);
        setExamType("");
        setDifficulty("");
        setTags([]);
      } else {

        alert(data.msg  || "Failed to add question.");
        console.log(data)
        console.log("Payload:", payload);
      }
    } catch (error) {
      console.error(error);
      alert("Error while adding question.");
    }
  };
  {
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Add Question</h1>

      {/* Question input */}
      <input
        type="text"
        placeholder="Type question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {/* Options */}
      <OptionGroup
        options={options}
        setOptions={setOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        title="Options"
        type="checkbox"
      />

      {/* Subject */}
      <div className="mt-4">
         <label className="block mb-1 text-xl">Subject</label>
        <div className="flex gap-5">
          {["MATHS", "PHYSICS", "BIO", "CHEMISTRY"].map((d) => (
            <label key={d}>
              <input
                type="radio"
                name="subject"
                value={d}
                checked={subject === d}
                onChange={(e) => setSubject(e.target.value as "MATHS" | "PHYSICS" | "BIO" | 'CHEMISTRY')}
              />
              {d}
            </label>
          ))}
       </div>
      </div>

      {/* Exam type */}
      <div className="mt-4">
        <label className="block mb-1 text-xl">Exam Type</label>
        <div className="flex gap-5">
          {["JEE", "NEET"].map((et) => (
            <label key={et}>
              <input
                type="radio"
                name="examType"
                value={et}
                checked={examType === et}
                onChange={(e) => setExamType(e.target.value as "JEE" | "NEET")}
              />
              {et}
            </label>
          ))}
        </div>
      </div>

      {/* Year */}
      <div className="mt-4">
        <label className="block mb-1 text-xl">Year</label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2"
        >
          {Array.from({ length: 26 }, (_, i) => 2000 + i).reverse().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty */}
      <div className="mt-4">
        <label className="block mb-1 text-xl">Difficulty</label>
        <div className="flex gap-5">
          {["EASY", "MEDIUM", "HARD"].map((d) => (
            <label key={d}>
              <input
                type="radio"
                name="difficulty"
                value={d}
                checked={difficulty === d}
                onChange={(e) => setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}
              />
              {d}
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4">
        <label className="block mb-1 text-xl">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag"
            className="border p-1 flex-1"
          />
          <button
            onClick={handleAddTag}
            type="button"
            className="bg-green-500 text-white px-3 rounded"
          >
            Add
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
              {tag}{" "}
              <button
                onClick={() => handleDeleteTag(tag)}
                type="button"
                className="text-red-500 font-bold"
              >
                x
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddQuestion}
        className="bg-blue-500 text-white px-4 py-2 mt-6 rounded"
      >
        Submit Question
      </button>
    </div>
  );
}

// OptionGroup Component
function OptionGroup({ options, setOptions, selectedOptions, setSelectedOptions, title, type }: OptionProps) {
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    const text = newOption.trim();
    if (!text) return;
    const id = options.length > 0 ? Math.max(...options.map((o) => o.id)) + 1 : 1;
    setOptions([...options, { id, text }]);
    setNewOption("");
  };

  const handleDeleteOption = (id: number) => {
    setOptions(options.filter((o) => o.id !== id));
    setSelectedOptions(selectedOptions.filter((s) => s !== id));
  };

  const handleSaveOption = (id: number) => {
    setOptions(
      options.map((o) => (o.id === id ? { ...o, text: o.text + " (Saved)" } : o))
    );
  };

  const handleSelectOption = (id: number) => {
    if (type === "checkbox") {
      setSelectedOptions(
        selectedOptions.includes(id)
          ? selectedOptions.filter((s) => s !== id)
          : [...selectedOptions, id]
      );
    } else {
      setSelectedOptions([id]);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl mb-2">{title}</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add new option"
          className="border p-1 flex-1"
        />
        <button onClick={handleAddOption} type="button" className="bg-green-500 text-white px-3 rounded">
          Add
        </button>
      </div>

      {options.map((opt) => (
        <div key={opt.id} className="flex items-center gap-2 mb-1">
          <input
            type={type}
            checked={selectedOptions.includes(opt.id)}
            onChange={() => handleSelectOption(opt.id)}
          />
          <label>{opt.text}</label>
          <button
            onClick={() => handleDeleteOption(opt.id)}
            type="button"
            className="bg-red-500 text-white px-2 rounded"
          >
            X
          </button>
          <button
            onClick={() => handleSaveOption(opt.id)}
            type="button"
            className="bg-blue-500 text-white px-2 rounded"
          >
            Save
          </button>
        </div>
      ))}
    </div>
  );
}


 {/* 
import { useEffect, useRef, useState, type JSX, type Key } from "react";

export default function AddQuestion() {

  const [question, setQuestion] = useState('');
  const [option, setOption] = useState([
    { id: 1, text: 'eg' }
  ]);
  const [answer, setAnswer] = useState('');
  const [subject, setSubject] = useState([

  ]);
  const [year, setYear] = useState(Number);
  const [examType, setExamType] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const [tags, setTags] = useState([]);





  const handleAddQuestion = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/admin/add/question', {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ question, option, answer, subject, year, examType, difficulty, tags })

      })
      const data = await res.json();

      if (res.ok) {
        alert('Question added!');
      }
      else {
        alert(data.msg || "Can't add  question")
      }
    }
    catch (e) {
      alert("erroe while creating")
    }
  }

  return (
    <>
      <input className="border mb-2" type="text" placeholder="type question" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <OptionGroup
        options={option}
        setOptions={setOption}
        title="Set options"
        type="checkbox"
      ></OptionGroup>
      <div>
        <h1 className="text-xl">Answer--</h1>
      <input className="border mb-1 shadow " type="text" placeholder="type answer" value={answer} onChange={(e) => { setAnswer(e.target.value) }} />
      </div>
      <div>
        {/* subject ke liye likh rha hu  
        <h1 className="text-xl">Exam type</h1>
        <div className="flex gap-5">
          <div>
            <input type="radio" id="jee" value={examType} name="examType" />
            <label htmlFor="jee">Jee</label>
          </div>
          <div>
            <input type="radio" id="neet" value={examType} name="examType" />
            <label htmlFor="neet">Neet</label>
          </div>
        </div>

        <div className="my-2">
          <label className="text-xl" htmlFor="year">Year-</label>
          <br />
          <select id="year">
  <option value={year}>2025</option>
  <option value={year}>2024</option>
  <option value={year}>2023</option>
  <option value={year}>2022</option>
  <option value={year}>2021</option>
  <option value={year}>2020</option>
  <option value={year}>2019</option>
  <option value={year}>2018</option>
  <option value={year}>2017</option>
  <option value={year}>2016</option>
  <option value={year}>2015</option>
  <option value={year}>2014</option>
  <option value={year}>2013</option>
  <option value={year}>2012</option>
  <option value={year}>2011</option>
  <option value={year}>2010</option>
  <option value={year}>2009</option>
  <option value={year}>2008</option>
  <option value={year}>2005</option>
  <option value={year}>2004</option>
  <option value={year}>2003</option>
  <option value={year}>2002</option>
  <option value={year}>2001</option>
  <option value={year}>2000</option>
</select>
        </div>

      </div>
       <div>
        {/* subject ke liye likh rha hu  
        <h1 className="text-xl">Difficulty type</h1>
        <div className="flex gap-5">
          <div>
            <input type="radio" id="easy" value={difficulty} name="difficultyType" />
            <label htmlFor="easy">Easy</label>
          </div>
          <div>
            <input type="radio" id="medium" value={difficulty} name="difficultyType" />
            <label htmlFor="medium">Medium</label>
          </div>
          <div>
            <input type="radio" id="Hard" value={difficulty} name="difficultyType" />
            <label htmlFor="Hard">Hard</label>
          </div>
         
        </div>
        <div>
          <label htmlFor="tags">Tags</label>
        <input className="border-2 mx-2 rounded shadow-lg" type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
        <button>Add</button>
        </div>
        </div>
    </>
  )

}

type OptionType = {

  id: number;
  text: string;
};

type OptionProps = {
  options: OptionType[];
  setOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
  title: string;
  type: string
};

function OptionGroup({ options, setOptions, title, type }: OptionProps) {
  const [newOption, setNewOption] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleCheckboxChange = (id: number): void => {
    if (selectedOptions.includes(id)) {
      const newSelected: number[] = [];
      for (let i = 0; i < selectedOptions.length; i++) {
        if (selectedOptions[i] !== id) newSelected.push(selectedOptions[i]);
      }
      setSelectedOptions(newSelected);
    } else {
      const newSelected: number[] = [];
      for (let i = 0; i < selectedOptions.length; i++) {
        newSelected.push(selectedOptions[i]);
      }
      newSelected.push(id);
      setSelectedOptions(newSelected);
    };
  }

  const handleAddOption = (): void => {
    if (newOption.trim() === "") return;
    const newID: number = options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1;
    const newOptions: OptionType[] = [];
    for (let i = 0; i < options.length; i++) {
      newOptions.push(options[i]);
    }
    newOptions.push({ id: newID, text: newOption });
    setOptions(newOptions);
    setNewOption("");
  };

  // Render options using for loop (no map/filter)
  const renderedOptions: JSX.Element[] = [];
  for (let i = 0; i < options.length; i++) {
    const opt: OptionType = options[i];

    // Delete handler
    const handleDelete = (): void => {
      const newOptions: OptionType[] = [];
      for (let j = 0; j < options.length; j++) {
        if (options[j].id !== opt.id) newOptions.push(options[j]);
      }
      setOptions(newOptions);
    };

    // Save handler (example: mark text as saved)
    const handleSave = (): void => {
      const newOptions: OptionType[] = [];
      for (let j = 0; j < options.length; j++) {
        if (options[j].id === opt.id) {
          newOptions.push({ ...options[j], text: options[j].text + " (Saved)" });
        } else {
          newOptions.push(options[j]);
        }
      }
      setOptions(newOptions);
    };

    renderedOptions.push(
      <div key={opt.id} className="flex items-center space-x-2">

        <input
          type={type}
          checked={selectedOptions.includes(opt.id)}
          onChange={() => handleCheckboxChange(opt.id)}
        />
        <label>{opt.text}</label>
        <button className="bg-red-500 text-white px-2 rounded" onClick={handleDelete}>
          X
        </button>
        <button className="bg-blue-500 text-white px-2 rounded" onClick={handleSave}>
          Save
        </button>
      </div>
    );
  }

  return (
    <div >

      <div className="mt-2">
        <h1 className="text-2xl">{title}</h1>
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add new option"
          className="border p-1 mr-2"
        />
        <button className="bg-green-500 text-white px-2 rounded" onClick={handleAddOption}>
          Add Option
        </button>
      </div>
      {renderedOptions}

    </div>
  );
}


// function  */}
