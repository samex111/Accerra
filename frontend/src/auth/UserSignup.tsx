import { useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Mail, EyeOff, User, Lock, Loader2, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'
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
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetch(`${API_URL}/api/v1/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setOtpSent(true)
        setSuccessMsg("We've sent a verification code to your email.")
      } else {
        setErrorMsg(data.msg || "Signup failed. Please try a different email or username.")
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true)
    setErrorMsg("")

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
      console.error(e)
      setErrorMsg("Error verifying OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      
      {/* Background Accents */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-400/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <Card className="shadow-2xl border-slate-200/60 backdrop-blur-xl bg-white/95">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="flex justify-center mb-2">
               <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
               </div>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
              {otpSent ? "Verify Your Email" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {otpSent 
                ? `Enter the code sent to ${email}` 
                : "Join thousands of students climbing the ranks."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={otpSent ? handleVerifyOtp : handleSignup} className="space-y-5">
              
              {/* Server Wake-up Notice (Only show initially) */}
              {!otpSent && !errorMsg && !successMsg && (
                <Alert className="bg-amber-50/80 border-amber-200 text-amber-800 backdrop-blur-sm py-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-xs ml-2 font-medium">
                    Backend on free tier. Initial request may take 10-15s.
                  </AlertDescription>
                </Alert>
              )}

              {/* Status Messages */}
              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <Alert variant="destructive" className="py-2.5 bg-red-50 text-red-900 border-red-200">
                        <AlertDescription className="text-sm font-medium">{errorMsg}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <Alert className="py-2.5 bg-green-50 text-green-900 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-sm font-medium ml-2">{successMsg}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {!otpSent ? (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2 group">
                      <Label htmlFor="email" className="text-slate-700 font-semibold text-sm transition-colors group-focus-within:text-blue-600">Email Address</Label>
                      <div className="relative transition-transform duration-200 ease-out focus-within:scale-[1.01]">
                        <Mail className="absolute left-3 top-2.5 text-slate-400 h-5 w-5 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 h-11 border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <Label htmlFor="username" className="text-slate-700 font-semibold text-sm transition-colors group-focus-within:text-blue-600">Username</Label>
                      <div className="relative transition-transform duration-200 ease-out focus-within:scale-[1.01]">
                        <User className="absolute left-3 top-2.5 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Choose a username"
                          className="pl-10 h-11 border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <Label htmlFor="password" className="text-slate-700 font-semibold text-sm transition-colors group-focus-within:text-blue-600">Password</Label>
                      <div className="relative transition-transform duration-200 ease-out focus-within:scale-[1.01]">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11 border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp-fields"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="space-y-2 group text-center">
                      <Label htmlFor="otp" className="text-slate-700 font-semibold text-sm">One-Time Password</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="000000"
                        className="h-14 text-center text-2xl tracking-widest font-mono border-slate-300 bg-slate-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  disabled={loading || (!otpSent ? (!email || !password || !username) : !otp)}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : !otpSent ? (
                    <>Continue <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    "Verify Account"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t border-slate-100/80 pt-6 pb-4">
            {otpSent && (
              <Button
                variant="ghost"
                className="text-slate-500 hover:text-slate-800 text-sm h-auto p-0"
                onClick={() => setOtpSent(false)}
                disabled={loading}
              >
                Entered wrong email? Go back.
              </Button>
            )}
            
            <p className="text-sm text-slate-600 font-medium">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-blue-600 hover:text-blue-800 font-bold text-sm tracking-wide"
                onClick={() => navigate("/signin")}
              >
                Log in
              </Button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}