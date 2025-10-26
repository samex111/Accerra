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
import PracticeQuestion from "./component/PracticeQuestion";
import Todo from "./component/Todo";
import { Navbar } from "./component/Navbar";

function App() {
  const [prompt , setPrompt] = useState('Hello how to be crack dev ans in 2 line ')
  const [op, setOp] = useState('');
  console.log(prompt);
  function handleEvent(event:any){
      if(event.key === "Enter"){
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
        <Route path="/questions/physics" element={<Questions subj="PHYSICS" mode="practice" />} />
        <Route path="/questions/chemistry" element={<Questions subj="CHEMISTRY" mode="practice" />} />
        <Route path="/user/select/subject" element={
          <div className="bg-[linear-gradient(135deg,#f6e8f4_0%,#f0eefa_50%,#dee8fe_100%)] w-full " >
              <Navbar></Navbar>
            <div className="flex justify-end p-10 ">
            <SelectSubject />
            <Todo></Todo>
            </div>
            <SolvedBarChart  />
             <GeminiStream prompt = {prompt} />
           <textarea  onKeyDown={handleEvent}     
           placeholder="Ask something....."
           onChange={(e)=>{setOp(e.target.value)}}
           className="border-4 w-1/2 mx-2 mt-2 h-1/2 scroll-smooth"
           
           >
            </textarea>
            <button id="btn"  onClick={()=>{setPrompt(op)}} >Send</button>
           
          </div>
         
        } />

        <Route path="/user/chat" element={<ChatApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

