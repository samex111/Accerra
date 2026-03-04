import { useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Mail, EyeOff, User, Lock, Loader2, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Target, TrendingUp, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { API_URL } from "@/config/env"

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(""); setSuccessMsg("");
    try {
      const res = await fetch(`${API_URL}/api/v1/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      })
      const data = await res.json()
      console.log("Signup response:", data) // Debug log for backend response
      if (res.ok) {
        setOtpSent(true)
        setSuccessMsg("We've sent a 6-digit verification code to your email.")
      } else {
        setErrorMsg(data.msg || "Signup failed. Please try a different email or username.")
      }
    } catch (e) {
      setErrorMsg("Network error. Please try again.")
    } finally { setLoading(false) }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/v1/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccessMsg("Account verified successfully! Redirecting...")
        setTimeout(() => navigate("/signin"), 1500)
      } else {
        setErrorMsg(data.msg || "Invalid OTP. Please try again.")
      }
    } catch (e) {
      setErrorMsg("Error verifying OTP. Please try again.")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-400/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="grid lg:grid-cols-2 w-full max-w-7xl mx-auto min-h-screen items-center">
        
        {/* Left Hero Section - Optimized Content */}
        <div className="hidden lg:flex flex-col justify-center px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="space-y-8 max-w-lg"
          >
            {/* <div className="inline-flex items-center rounded-full bg-blue-100/50 border border-blue-200 px-3 py-1 text-sm font-semibold text-blue-800">
              <Sparkles className="w-4 h-4 mr-2 fill-blue-600" />
              Start Your AI-Powered JEE Prep
            </div> */}
            
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Turn Your Weak Topics Into <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Your Strongest Scores
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              Accerra analyzes your mistakes, adapts your practice in real time, and shows exactly where you lose marks in JEE mock tests.
            </p>

            <ul className="space-y-3">
              {[
                "AI detects weak concepts instantly",
                "Solve targeted JEE-level questions",
                "See exactly where you lose marks"
              ].map((text, i) => (
                <li key={i} className="flex items-center text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" /> {text}
                </li>
              ))}
            </ul>

            {/* Credible Stats Section */}
            <div className="flex items-center gap-10 pt-6 border-t border-slate-200/60">
               <div>
                 <div className="flex items-center text-slate-900 font-bold text-xl italic">
                   <Target className="w-5 h-5 text-blue-500 mr-2" /> Thousands
                 </div>
                 <div className="text-sm font-medium text-slate-500 mt-1">Practice attempts analyzed</div>
               </div>
               <div>
                 <div className="flex items-center text-slate-900 font-bold text-xl italic">
                   <TrendingUp className="w-5 h-5 text-green-500 mr-2" /> Rapid
                 </div>
                 <div className="text-sm font-medium text-slate-500 mt-1">Weak topic discovery</div>
               </div>
            </div>

            {/* After Signup Preview */}
            <div className="bg-white/50 border border-slate-200 p-4 rounded-xl space-y-3">
               <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">What happens after signup?</p>
               <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <div className="space-y-1">
                    <span className="font-bold text-blue-600">1. Diagnostic</span>
                    <p>5-min skill check</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-blue-600">2. Analysis</span>
                    <p>See weak topics</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-blue-600">3. Roadmap</span>
                    <p>Get practice plan</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Right Form Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-auto z-10"
        >
          <Card className="shadow-2xl border-slate-200/60 backdrop-blur-xl bg-white/95">
            <CardHeader className="space-y-2 pb-6 text-center">
              <CardTitle className="text-2xl font-extrabold text-slate-900">
                {otpSent ? "Check Your Email" : "Create Your Accerra Account"}
              </CardTitle>
              <CardDescription className="text-slate-500">
                {otpSent 
                  ? "Enter the 6-digit verification code to secure your account." 
                  : "Your AI study assistant is ready to start."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={otpSent ? handleVerifyOtp : handleSignup} className="space-y-5">
                <AnimatePresence mode="wait">
                  {!otpSent ? (
                    <motion.div key="signup" className="space-y-4">
                      <div className="space-y-2 group">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
                          <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                      </div>

                      <div className="space-y-2 group">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
                          <Input id="username" placeholder="Choose a username" className="pl-10" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                      </div>

                      <div className="space-y-2 group">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
                          <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 ml-1">Use at least 8 characters</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="otp" className="space-y-4 py-2">
                       <Label className="text-center block">Verification Code</Label>
                       <Input id="otp" type="text" placeholder="0 0 0 0 0 0" className="h-14 text-center text-2xl tracking-[0.75em] font-mono" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-lg" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : otpSent ? "Verify & Start Learning" : "Create My Account"}
                  </Button>
                  <p className="text-[11px] text-center text-slate-400 mt-3">No spam. Only study updates. We respect your privacy.</p>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col border-t pt-4">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Button variant="link" className="p-0 text-blue-600 font-bold" onClick={() => navigate("/signin")}>Log in</Button>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}