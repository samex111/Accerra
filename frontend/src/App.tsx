import { BrowserRouter, Routes, Route } from "react-router-dom";

import SelectSubject from "./component/SelectSubject";
import SolvedBarChart from "./component/Chart";
import GeminiStream from "./component/geminiResponse";
import Todo from "./component/Todo";
import DashBoard from "./pages/DashBoard";
import Bookmarks from "./component/Bookmark";
import PracticeQuestion from "./component/PracticeQuestion";
import LandingPage from "./pages/LandingPage";
import SignUp from "./component/UserSignup";
import Signin from "./component/UserSignin";


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/signin" element={<Signin/>}></Route>
        <Route path="maths" element={<PracticeQuestion mode='practice' subj='MATHS'/>}></Route>
<Route path="/dashboard" element={<DashBoard />}>
  {/* Index route: No absolute positioning, use flex-grow */}
<Route index element={
  <div className="absolute left-[16vw] space-y-6">
    {/* Hero Section */}
    <section>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
      <p className="text-slate-500 mt-1">Here is what's happening with your progress today.</p>
    </section>

    {/* Responsive Grid System */}
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
       
       {/* Select Subject - Takes 7 columns on large screens */}
       <div className="xl:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-1 hover:shadow-md transition-shadow">
          <SelectSubject />
       </div>

       {/* Todo List - Takes 5 columns on large screens */}
       {/* <div className="xl:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full min-h-[300px]"> */}
          <Todo />
       {/* </div> */}
       
       {/* Chart - Full Width */}
       <div className="xl:col-span-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Solved Analytics</h3>
            <span className="text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
          </div>
          <div className="w-full h-[400px]">
             <SolvedBarChart />
          </div>
       </div>
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

