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
import GeminiStream from "./component/SSE";
import { useState } from "react";

function App() {
  const [prompt , setPrompt] = useState('Hello gemini')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div><LandingPage />

           <GeminiStream prompt = {prompt} />
           <input
           value={prompt}
           onChange={(e)=>setPrompt(e.target.value)}
           placeholder="Ask something....."
           className="border-4"
           >
           
           </input>
           </div>
           } />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/signin" element={<Signin />} />
        <Route path="/admin/addQuestion" element={<AddQuestion />} />
        <Route path="/questions/maths" element={<Questions subj="MATHS" mode="practice" />} />
        <Route path="/questions/physics" element={<Questions subj="PHYSICS" mode="practice" />} />
        <Route path="/questions/chemistry" element={<Questions subj="CHEMISTRY" mode="practice" />} />
        <Route path="/user/select/subject" element={
          <div>
            <SelectSubject />  
            <SolvedBarChart  />
          </div>
         
        } />

        <Route path="/user/chat" element={<ChatApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

