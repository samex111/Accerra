import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { Home, Settings, Bookmark, Brain } from "lucide-react";

const navItems = [
  { title: "Home", icon: Home, path: "/dashboard" },
  { title: "Understand with AI", icon: Brain, path: "/dashboard/ai" },
  { title: "Bookmark", icon: Bookmark, path: "/dashboard/bookmarks" },
  { title: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function DashBoard() {
  const location = useLocation(); // Used to highlight the active tab

  return (
    <div className="flex h-screen w-full bg-gradient-to-b from-purple-50 to-pink-100 overflow-hidden">
      <SidebarProvider>
        <Sidebar className="w-[16vw] border-r border-gray-200">
          <SidebarContent className="bg-gray-900 text-white">
            <SidebarGroup>
              <SidebarGroupLabel className="text-blue-400 px-4 py-6 text-lg font-bold">
                Accerra AI
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                              isActive 
                                ? "bg-blue-600 text-white shadow-md" 
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            <item.icon size={20} />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              {/* Outlet renders the child components based on the URL */}
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarProvider>
    </div>
  );
}
