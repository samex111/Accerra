import { BrowserRouter, Routes, Route } from "react-router-dom";
import Questions from "./pages/Question";
import AddQuestion from "./pages/AddQuestion";
import AdminSignin from "./component/AdminSignin";
import AdminSignup from "./component/AdminSignup";
import Signin from "./component/UserSignin";
import Signup from "./component/UserSignup";
import LandingPage from "./pages/LandingPage";
import ChatApp from "./pages/chat";
import SelectSubject from "./component/SelectSubject";
import SolvedBarChart from "./component/Chart";
import GeminiStream from "./component/geminiResponse";
import { useState } from "react";
import PracticeQuestion from "./component/PracticeQuestion";
import Todo from "./component/Todo";
import DashBoard from "./pages/DashBoard";

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
        <Route path="/" element={
          <div><LandingPage />


            {/* <ChatWithAi></ChatWithAi> */}
          </div>
        } />

        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/signin" element={<Signin />} />
        <Route path="/admin/addQuestion" element={<AddQuestion />} />
        <Route path="/questions/maths" element={<PracticeQuestion subj="MATHS" mode="practice" />} />
        <Route path="/questions/physics" element={<PracticeQuestion subj="PHYSICS" mode="practice" />} />
        <Route path="/questions/chemistry" element={<PracticeQuestion subj="CHEMISTRY" mode="practice" />} />
        <Route path="/questions/test" element={<Questions subj="CHEMISTRY" mode="practice" />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/user/chat" element={<ChatApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

