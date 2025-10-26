import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // ✅ correct import (not from radix directly)
import { Loader2 } from "lucide-react"

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:3000/api/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await res.json()
      console.log(data)

      if (res.ok) {
        setOtpSent(true)
        alert("OTP sent to your email ✅")
      } else {
        alert(data.msg || "Signup failed ❌")
      }
    } catch (e) {
      console.error(e)
      alert("Error during signup")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:3000/api/v1/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      console.log(data)

      if (res.ok) {
        alert("Signup verified 🎉")
        navigate("/user/signin")
      } else {
        alert(data.msg || "OTP verification failed ❌")
      }
    } catch (e) {
      console.error(e)
      alert("Error verifying OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 px-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold text-gray-800">
            Create your account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* OTP Field (show only after signup) */}
          {otpSent && (
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {!otpSent ? (
            <Button onClick={handleSignup} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Send OTP"}
            </Button>
          ) : (
            <Button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Verify OTP"}
            </Button>
          )}

          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/user/signin")}
          >
            Already have an account? Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
