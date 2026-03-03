import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BrainCircuit, 
  BarChart3, 
  Target, 
  BookOpenCheck,
  XCircle,
  CheckCircle2
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const bgImageUrl = "/hero-image-1.png";

  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* --- HERO SECTION --- */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
        style={{ backgroundImage: `url('${bgImageUrl}')` , zIndex: 10  }}
      >
        <div className="absolute inset-0 bg-gradient-to-b  from-white via-white/80 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col flex-1">
          {/* Navbar */}
          <nav className="w-full flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900 flex items-center">
                <span className="text-red-500 mr-2 text-3xl leading-none">∿</span> 
                Accerra
              </span>
            </div>

            <div className=" items-center gap-4 md:flex">
              <Button onClick={() => navigate("/signin")} variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium">
                Log in
              </Button>
              <Button onClick={() => navigate("/signup")} className="rounded-full bg-black px-6 text-white hover:bg-gray-800 shadow-sm">
                Sign up
              </Button>
            </div>
          </nav>

          {/* Hero Content */}
          <main className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto pt-10 pb-20">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-800 mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              The AI Study Engine for JEE & NEET
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              Prepare smarter. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Not longer.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed sm:text-xl">
              Accerra combines structured question practice, real-time AI tutoring, and deep performance analytics into one focused platform built specifically for JEE and NEET students.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
              <Button onClick={() => navigate("/signup")} size="lg" className="h-14 rounded-full bg-black px-8 text-base text-white hover:bg-gray-800 shadow-lg group">
                Start Practicing Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </main>
        </div>
      </div>

      {/* --- PROBLEM VS SOLUTION SECTION --- */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Problem */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">JEE & NEET prep is broken.</h2>
              <p className="text-gray-600 text-lg">Students don't need more generic content. They need clarity, speed, and actionable feedback.</p>
            </div>
            <ul className="space-y-4">
              {[
                "Resources are scattered across multiple apps",
                "Doubts take hours or days to resolve",
                "No clear, personalized performance insights",
                "Generic content that isn't exam-focused"
              ].map((item, i) => (
                <li key={i} className="flex items-start text-gray-700">
                  <XCircle className="h-6 w-6 text-red-500 mr-3 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">The Accerra Solution</h2>
            <p className="text-gray-600 mb-8">An AI-powered study system designed strictly for JEE & NEET. One platform. Full control.</p>
            <ul className="space-y-4">
              {[
                "Structured, exam-specific question bank",
                "Real-time AI tutor powered by Google Gemini",
                "Deep performance analytics & trends",
                "Personalized learning and practice tools"
              ].map((item, i) => (
                <li key={i} className="flex items-start text-gray-800 font-medium">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Everything you need to excel</h2>
          <p className="text-xl text-gray-600">Practice what matters, analyze your mistakes, and improve your scores with AI precision.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 transition-all hover:shadow-md">
            <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center mb-6">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Question Practice</h3>
            <p className="text-gray-600 mb-6">Practice what actually matters with detailed solutions and diagrams.</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Physics, Chemistry, Mathematics</li>
              <li>• Difficulty-based filtering (Easy / Medium / Hard)</li>
              <li>• Year-wise questions (2000–2025)</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 transition-all hover:shadow-md">
            <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center mb-6">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI Tutor, Always Available</h3>
            <p className="text-gray-600 mb-6">No waiting. No coaching dependency. Get your doubts solved instantly.</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Instant doubt resolution</li>
              <li>• Context-aware, streaming explanations</li>
              <li>• Personalized hints to guide your thinking</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 transition-all hover:shadow-md">
            <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Analytics That Improve Scores</h3>
            <p className="text-gray-600 mb-6">Know exactly where you’re losing marks and how to fix it.</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Subject-wise performance tracking</li>
              <li>• Attempted vs. solved breakdown</li>
              <li>• Historical progress and time-based trends</li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 transition-all hover:shadow-md">
            <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Built for Focus</h3>
            <p className="text-gray-600 mb-6">Discipline meets intelligence. Tools designed for serious aspirants.</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Bookmark important questions</li>
              <li>• Attach personal notes to problems</li>
              <li>• Create study todos and track daily progress</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-black rounded-[2.5rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Crack JEE & NEET with AI precision.
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Most platforms just give you content. Accerra gives you a feedback loop: <br className="hidden md:block" />
              <span className="text-white font-semibold">Practice → Analyze → Improve → Repeat.</span>
            </p>
            <Button onClick={() => navigate("/signup")} size="lg" className="h-14 rounded-full bg-white text-black hover:bg-gray-100 px-10 text-lg font-medium shadow-xl">
              Start Free Today
            </Button>
          </div>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-100">
        <p>© {new Date().getFullYear()} Accerra. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;