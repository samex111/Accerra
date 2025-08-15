import { motion } from "motion/react";

function App() {

  return (
    <>
    <motion.div className="text-5xl flex justify-center" 
    initial={{ scale: 0 }}
    animate= {{scale:1.1 ,   transition: { duration: 1 } }}
    >
      @Accerra 
      <p>Your Era of Acceleration</p>
    </motion.div>
    </>
  );
}

export default App;
