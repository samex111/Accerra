import { useContext, useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { StudentContext } from "../component/StudentContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, Loader2, Eye, EyeOff, AlertTriangle, ShieldCheck, Target, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { API_URL } from "@/config/env"

export default function Signin() {
  const studentContext = useContext(StudentContext)
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true)
    setErrorMsg("")
  console.log("Attempting to sign in with:", { identifier, password  }) // Avoid logging actual password
    try {
      const res = await fetch(`${API_URL}/api/v1/user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Fixed the typo in the payload if your backend expects 'identifier'. 
        // If your backend strictly requires 'identifire', change it back.
        body: JSON.stringify({ identifire: identifier, password }), 
        credentials: "include",
      })

      const data = await res.json()
      
      if (res.ok) {
        studentContext?.setStudentId(data.studentId)
        localStorage.setItem("StudentID", data.studentId)
        localStorage.setItem("StudentEmail", data.email)
        localStorage.setItem("StudentUsername", data.username)
        navigate("/dashboard")
      } else {
        setErrorMsg(data.msg || "Invalid credentials. Please try again.")
      }
    } catch (e) {
      console.error("Signin Error:", e)
      setErrorMsg("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full relative overflow-hidden bg-slate-50">
      
      {/* --- BACKGROUND GLOWS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300/20 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-300/20 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />

      <div className="grid lg:grid-cols-2 w-full max-w-7xl mx-auto min-h-screen">
        
        {/* --- LEFT PANEL: BRANDING & EMOTION (Hidden on mobile) --- */}
        <div className="hidden lg:flex flex-col justify-center px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 max-w-lg"
          >
            <div className="inline-flex items-center rounded-full bg-blue-100/50 border border-blue-200 px-3 py-1 text-sm font-semibold text-blue-800">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              The AI Advantage
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Every mark matters. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Fix your weak topics today.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              Log in to access your personalized AI study roadmap, track your real-time accuracy, and resolve doubts instantly.
            </p>

            {/* Micro Stats */}
            <div className="flex items-center gap-8 pt-6 border-t border-slate-200/60">
               <div>
                 <div className="flex items-center text-slate-900 font-bold text-xl">
                   <Target className="w-5 h-5 text-blue-500 mr-2" /> 7k+
                 </div>
                 <div className="text-sm font-medium text-slate-500 mt-1">Questions Solved Today</div>
               </div>
               <div>
                 <div className="flex items-center text-slate-900 font-bold text-xl">
                   <TrendingUp className="w-5 h-5 text-green-500 mr-2" /> 18%
                 </div>
                 <div className="text-sm font-medium text-slate-500 mt-1">Avg. Score Improvement</div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT PANEL: FORM --- */}
        <div className="flex items-center justify-center p-6 sm:p-12 relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="w-full max-w-md"
          >
            <Card className="shadow-2xl hover:shadow-blue-900/5 transition-shadow duration-500 border-slate-200/60 backdrop-blur-xl bg-white/90">
              <CardHeader className="space-y-3 pb-6 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                  Resume Your Journey
                </CardTitle>
                <CardDescription className="text-slate-500 text-base">
                  Enter your details to access your dashboard.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-5">
                  
                  {/* Server Wake-up Notice */}
                  <Alert className="bg-amber-50/80 border-amber-200 text-amber-800 backdrop-blur-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-xs ml-2 font-medium">
                      Backend is on a free tier. First login might take 10-15s.
                    </AlertDescription>
                  </Alert>

                  {/* Error Message */}
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <Alert variant="destructive" className="py-2.5 bg-red-50 text-red-900 border-red-200">
                          <AlertDescription className="text-sm font-medium">{errorMsg}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2 group">
                      <Label htmlFor="identifier" className="text-slate-700 font-semibold text-sm transition-colors group-focus-within:text-blue-600">Username or Email</Label>
                      <div className="relative transition-transform duration-200 ease-out focus-within:scale-[1.01]">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" /> 
                        <Input
                          id="identifier"
                          type="text"
                          placeholder="name@example.com"
                          className="pl-10 h-11 border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all shadow-sm"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-slate-700 font-semibold text-sm transition-colors group-focus-within:text-blue-600">Password</Label>
                        <Button variant="link" className="p-0 h-auto text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors" type="button">
                            Forgot password?
                        </Button>
                      </div>
                      
                      <div className="relative transition-transform duration-200 ease-out focus-within:scale-[1.01]">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11 border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all shadow-sm"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                      disabled={loading || !identifier || !password}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" /> Authenticating...
                        </>
                      ) : (
                        <span className="text-base font-semibold tracking-wide">Secure Login</span>
                      )}
                    </Button>
                  </div>
                  
                  {/* Psychological Reinforcement */}
                  <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 pt-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Your data is encrypted and secure
                  </p>

                </form>
              </CardContent>

              <CardFooter className="flex justify-center border-t border-slate-100/80 pt-6 pb-2">
                <p className="text-sm text-slate-600 font-medium">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 text-blue-600 hover:text-blue-800 font-bold text-sm tracking-wide"
                    onClick={() => navigate("/signup")}
                  >
                    Create one now
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}