import { motion } from "motion/react";
import Signin from "./pages/UserSignin";
import SignUp from "./pages/UserSignup";
import Questions from "./pages/Question";
import AddQuestion from "./pages/AddQuestion";
import AdminSignin from "./pages/AdminSignin";
import AdminSignup from "./pages/AdminSignup";

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
      <AdminSignup></AdminSignup>
      <AdminSignin></AdminSignin>
      <Questions></Questions>
      <AddQuestion></AddQuestion>

    </>
  );




}




export default App;
