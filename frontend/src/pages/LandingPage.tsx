import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X, Check, PlayCircle, BarChart, Target, Brain } from "lucide-react";
import FloatingLogo from "@/component/FloatingText";

const LandingPage = () => {
  const navigate = useNavigate();
  const bgImageUrl = "./hero-image-1.png";

  return (
    <div className="font-sans text-[#0F172A] bg-white selection:bg-[#2563EB]/20">
      <div className="relative overflow-hidden pb-20">

        {/* --- PREMIUM BACKGROUND BASE --- */}
        <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
        style={{ backgroundImage: `url('${bgImageUrl}')` , zIndex: 10  }}
      >
        <div className="absolute -z-10 inset-0 bg-gradient-to-b  from-white via-white/80 to-transparent pointer-events-none" />

        {/* --- DUAL-TONE PREMIUM GLOWS (Tamed for sharper look) --- */}
        <FloatingLogo />
        <div 
          className="bg-gradient-to-br from-white via-slate-50 to-slate-100 absolute -top-40 left-0 w-[600px] h-[600px] blur-[100px] rounded-full -z-10 opacity-40 mix-blend-multiply" 
          aria-hidden="true"
        />
        <div 
          className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[#38BDF8]/10 blur-[120px] rounded-full -z-10 opacity-30 mix-blend-multiply" 
          aria-hidden="true"
        />

        {/* --- NAVBAR --- */}
        <nav className="w-full flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center">
              <span className="text-[#2563EB] z-50 mr-2 text-2xl leading-none">∿</span> 
              Accerra
            </span>
          </div>
    
          <div className="flex items-center z-50 gap-6">
            <Button variant={'ghost'}
              onClick={() => navigate("/signin")} 
              className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Log in
            </Button >
            <Button 
              onClick={() => navigate("/signup")} 
              className="rounded-md bg-[#0F172A] px-5 py-2 text-sm text-white hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-sm"
            >
              Start Free
            </Button>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <main className="flex flex-col justify-center items-center text-center px-6 max-w-5xl mx-auto pt-24 md:pt-32">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-800 mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#00c3ff] mr-2"></span>
              The AI Study Engine for JEE & NEET
            </div>
          {/* Competitive, outcome-driven headline */}
           <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
               The unfair advantage for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">serious JEE aspirants.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed sm:text-xl">
            Stop losing marks on concepts you "almost" know. Master the hardest topics instantly with real-time AI feedback and precision analytics.
            </p>

         

  

          <div className="mt-10 flex flex-col items-center gap-4 w-full sm:w-auto">
            <Button 
              onClick={() => navigate("/signup")} 
              size="lg" 
              className="h-14 rounded-md bg-[#0e9df0] px-10 text-lg font-medium text-white hover:bg-[#76bbe4] hover:shadow-lg hover:shadow-[#2563EB]/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center group"
            >
              Start Your AI Prep Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            {/* Risk-free microcopy */}
            <p className="text-sm text-[#64748B] font-medium mt-1 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Start your journey today.
            </p>
          </div>

          {/* --- TANGIBLE PRODUCT PREVIEW --- */}
          <div className="mt-20 w-full aspect-[16/9] md:aspect-[21/9] bg-slate-50 border border-slate-200/80 rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
            {/* Fake Browser Chrome */}
            <div className="w-full h-10 bg-white border-b border-slate-200/80 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              </div>
            </div>
            {/* UI Placeholder (Replace with actual screenshot later) */}
            <div className="absolute inset-0 top-10 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white">
              <PlayCircle className="w-16 h-16 text-[#2563EB]/20 mb-4" />
              <p className="text-slate-400 font-medium tracking-wide">Accerra Dashboard Interface</p>
            </div>
          </div>
        </main>
      </div>
      </div>

      {/* --- SOCIAL PROOF & METRICS --- */}
      <section className="py-16 border-y border-slate-100 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16">
            <div>
              <div className="text-3xl font-extrabold text-[#0F172A]">100+</div>
              <div className="text-sm font-medium text-[#64748B] mt-1">Doubts Resolved</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#0F172A]">7k+</div>
              <div className="text-sm font-medium text-[#64748B] mt-1">Questions Practiced</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#0F172A]">+18%</div>
              <div className="text-sm font-medium text-[#64748B] mt-1">Avg. Score Boost</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#0F172A]">24/7</div>
              <div className="text-sm font-medium text-[#64748B] mt-1">AI Availability</div>
            </div>
          </div>
          
          {/* Safe Authority Logos */}
          <div className="text-center  border-slate-200/60 pt-10">
            <p className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-6">
              Our students study at India's top coaching institutes
            </p>
            {/* Replaced trademarked names with generic prestige markers to avoid legal friction */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span>ALLEN</span>
              <span>PW</span>
              <span>UNACADEMY</span>
              <span>NARAYANA</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE CATEGORY SHIFT (Why Now?) --- */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center text-[#0F172A] mb-20 leading-[1.1]">
            Most platforms give you content.<br className="hidden md:block" />
            <span className="text-[#2563EB]"> Accerra gives you a competitive edge.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 md:gap-0 relative">
            
            {/* TRADITIONAL SIDE */}
            <div className="space-y-6 md:pr-12">
              <h3 className="font-semibold text-[#94A3B8] uppercase tracking-wider text-sm">
                Traditional Preparation
              </h3>
              <ul className="space-y-5">
                {[
                  "Endless, untargeted question banks",
                  "One-size-fits-all mock tests",
                  "Manual mistake tracking",
                  "Doubts stay unresolved for days"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-[#64748B] text-lg">
                    <X className="w-5 h-5 text-slate-300 mr-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* ACCERRA SIDE */}
            <div className="space-y-6 pt-12 md:pt-0 md:pl-12 border-t md:border-t-0 md:border-l border-slate-200">
              <h3 className="font-bold text-[#2563EB] uppercase tracking-wider text-sm">
                With Accerra AI
              </h3>
              <ul className="space-y-5">
                {[
                  "AI targets exactly what you don't know",
                  "Practice adapts to your weak topics",
                  "Real-time, context-aware doubt resolution",
                  "Built-in continuous feedback loop"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-[#0F172A] font-medium text-lg">
                    <Check className="w-5 h-5 text-[#2563EB] mr-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Outcome reframed) --- */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-slate-100">
        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-16 text-center">
          The fastest path to a higher rank
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-3 group cursor-default">
            <div className="text-[#2563EB] font-bold text-xl group-hover:translate-x-1 transition-transform">01. Target Weaknesses</div>
            <h3 className="text-xl font-bold text-[#0F172A]">Stop wasting time.</h3>
            <p className="text-[#64748B] leading-relaxed">
              Dive straight into structured, difficulty-based questions built exactly for the modern JEE pattern.
            </p>
          </div>
          
          <div className="space-y-3 group cursor-default">
            <div className="text-[#2563EB] font-bold text-xl group-hover:translate-x-1 transition-transform">02. Instant Clarity</div>
            <h3 className="text-xl font-bold text-[#0F172A]">Never get stuck.</h3>
            <p className="text-[#64748B] leading-relaxed">
              Get 24/7 AI explanations that actually guide your thinking, not just hand you the final answer.
            </p>
          </div>
          
          <div className="space-y-3 group cursor-default">
            <div className="text-[#2563EB] font-bold text-xl group-hover:translate-x-1 transition-transform">03. Watch Scores Rise</div>
            <h3 className="text-xl font-bold text-[#0F172A]">Fix your blind spots.</h3>
            <p className="text-[#64748B] leading-relaxed">
              Deep visual analytics map exactly where you lose marks so you can study with sniper precision.
            </p>
          </div>
        </div>
      </section>

      {/* --- OUTCOME BLOCKS (FLAT & ASPIRATIONAL) --- */}
      <section className="py-24 px-6 bg-[#F8FAFC] border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-12">
            Engineered for top percentiles.
          </h2>

          <div className="flex flex-col">
            <div className="py-10 border-t border-slate-200 hover:bg-white transition-colors px-4 -mx-4 rounded-xl">
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 flex items-center">
                <Brain className="w-5 h-5 text-[#2563EB] mr-4 shrink-0" />
                Never Wait for Tutors Again
              </h3>
              <p className="text-[#64748B] ml-9 text-lg">
                Context-aware AI streamed in real-time. Whether it's 2 PM or 2 AM, your doubts are resolved instantly.
              </p>
            </div>

            <div className="py-10 border-t border-slate-200 hover:bg-white transition-colors px-4 -mx-4 rounded-xl">
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 flex items-center">
                <BarChart className="w-5 h-5 text-[#2563EB] mr-4 shrink-0" />
                Eliminate Your Blind Spots
              </h3>
              <p className="text-[#64748B] ml-9 text-lg">
                Attempted vs. solved breakdowns. Time-based accuracy metrics. Know exactly what to revise before the exam.
              </p>
            </div>

            <div className="py-10 border-t border-b border-slate-200 hover:bg-white transition-colors px-4 -mx-4 rounded-xl">
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 flex items-center">
                <Target className="w-5 h-5 text-[#2563EB] mr-4 shrink-0" />
                Study with Sniper Focus
              </h3>
              <p className="text-[#64748B] ml-9 text-lg">
                Bookmark critical problems, attach digital notes, and track your daily targets. Discipline meets intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-6">
            Your competitors are studying. Are you?
          </h2>
          <Button 
            onClick={() => navigate("/signup")} 
            size="lg" 
            className="mt-8 h-14 rounded-md bg-[#2563EB] px-12 text-lg font-medium text-white hover:bg-[#1D4ED8] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Claim Your Edge Now
          </Button>
          <p className="text-sm text-[#64748B] font-medium mt-4">
            Join thousands of serious aspirants. Free forever for basic practice.
          </p>
        </div>
      </section>
      
      {/* --- FOOTER --- */}
      <footer className="py-12 text-center border-t border-slate-100 flex flex-col items-center justify-center space-y-4">
        <p className="text-[#64748B] font-medium text-sm">
          Built by engineers who cracked JEE themselves.
        </p>
        <p className="text-[#94A3B8] text-xs">
          © {new Date().getFullYear()} Accerra. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;