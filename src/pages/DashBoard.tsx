
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SolvedBarChart from "@/component/Chart";
import SelectSubject from "@/component/SelectSubject";
import Todo from "@/component/Todo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Home, Settings, Bookmark, Pen, Menu, Brain, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import GeminiStream from "@/component/geminiResponse";
import Bookmarks from "@/component/Bookmark";
 
const items = [
  { title: "Home", icon: Home },
  { title: "Understand with AI", icon: Brain },
  { title: "Bookmark", icon: Bookmark },
  { title: "Settings", icon: Settings },
];

export default function DashBoard() {
  const [open, setOpen] = useState(true);
  const [item , setItem ] = useState('Home');
  return (
    <div className="relative w-full h-screen flex  bg-gradient-to-b from-purple-50 to-pink-100 overflow-hidden">
      {/* Hamburger */}
      {/* {useIsMobile() && <button
        className="absolute top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        onClick={() => setOpen(!open)}
      >
        <Menu />
      </button> */}
{/* } */}
      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: "tween" }}
            className="fixed top-0 left-0 h-full w-1 bg-gray-900 text-white flex flex-col justify-between p-4 z-40 shadow-lg"
          >
             <SidebarProvider>
            <Sidebar className="w-[16vw]">
              <SidebarContent >
                <SidebarGroup>
                  <SidebarGroupLabel className="text-blue-400">Application</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                           
                      {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <button onClick={
                              ()=>{
                                if(item.title==="Understand with AI"){
                                  setItem("Understand with AI")
                                }
                                else if(item.title === "Bookmark"){
                                  setItem("Bookmark")
                                }
                                else if(item.title === "Settings"){
                                  setItem("Settings")
                                }
                                else{
                                  setItem("Home")
                                }
                              }
                            } className="flex items-center gap-3  hover:bg-gray-700 rounded-lg px-3 py-2">
                              <item.icon  size={18} />
                              <span>{item.title}</span>
                            </button>
                          </SidebarMenuButton>
                          
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            </SidebarProvider>

           
        
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      { item === "Home" ?
      <main className="absolute h-screen  left-[16vw] flex w-[84vw]  flex-col items-center justify-center px-[2vw]  ">
        <div className="w-full h-[50vh]  flex  justify-between">
        <SelectSubject />
        <Todo />
        </div>
        <div className=" w-full h-[40vh]" >
          <SolvedBarChart  />

        </div>
      </main> : item ==="Understand with AI" ?   <GeminiStream   /> : 
       <Bookmarks></Bookmarks>
}
    </div>
  );
}
