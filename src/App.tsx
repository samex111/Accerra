import { BrowserRouter, Routes, Route } from "react-router-dom";

import SelectSubject from "./component/SelectSubject";
import SolvedBarChart from "./component/Chart";
import GeminiStream from "./component/geminiResponse";
import { useState } from "react";
import Todo from "./component/Todo";
import DashBoard from "./pages/DashBoard";
import Bookmarks from "./component/Bookmark";

function App() {
  const [prompt, setPrompt] = useState('Hello how to be crack dev ans in 2 1 para')
  const [op, setOp] = useState('');
  console.log(prompt);
  function handleEvent(event: any) {
    if (event.key === "Enter") {
      setPrompt(op);
      console.log("Enter press")

    }
  }
  return (
    <BrowserRouter>
      <Routes>
        // Inside your Routes in App.tsx
<Route path="/dashboard" element={<DashBoard />}>
  {/* Index route renders at /dashboard */}
  <Route index element={
    <div className="flex flex-col absolute left-[16vw] items-center justify-center p-8 gap-8">
       <div className="w-full flex justify-between gap-6">
         <SelectSubject />
         <Todo />
       </div>
       <div className="w-full   bg-white p-6 rounded-xl shadow-sm">
         <SolvedBarChart />
       </div>
    </div>
  } />
  
  <Route path="ai" element={<GeminiStream />} />
  <Route path="bookmarks" element={<Bookmarks />} />
  <Route path="settings" element={<div>Settings Component Here</div>} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

