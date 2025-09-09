import Questions from "./pages/Question";
import AddQuestion from "./pages/AddQuestion";
import AdminSignin from "./component/AdminSignin";
import AdminSignup from "./component/AdminSignup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./component/UserSignin";
import Signup from "./component/UserSignup";
import LandingPage from "./pages/LandingPage";
import ChatApp from "./pages/chat";

function App() {

 
  return (
    <>
      {/* <motion.div className="text-5xl flex justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1.1, transition: { duration: 1 } }}
      >
        @Accerra
        <p>Your Era of Acceleration</p>
      </motion.div> */}
      <BrowserRouter>
      
        <Routes>
           <Route path="/" element={< LandingPage />} />
           <Route path="/admin/signup" element={<AdminSignup />} />
           <Route path="/admin/signin" element={<AdminSignin />} />
           <Route path="/user/signup" element={<Signup />} />
           <Route path="/user/signin" element={<Signin />} />
           <Route path="/admin/addQuestion" element={<AddQuestion />} />
           <Route path="/user/preview" element={<Questions />} />
           <Route path="/user/chat" element={<ChatApp />} />
      
      
      </Routes>
      </BrowserRouter>

    </>
  );




}




export default App;
