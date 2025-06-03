"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "../Common/button"
import { Input } from "../Common/input"
import { Label } from "../Common/label"
import { useNavigate } from "react-router-dom"

export const DirectSignInGP = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const payload = {
      email,
      password
    }

    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/gp-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        // Store user information in localStorage
        localStorage.setItem('userName', data.userName)
        localStorage.setItem('userEmail', email)
        localStorage.setItem('firm', data.firm)
        localStorage.setItem('position', data.position)
        localStorage.setItem('token', data.token)
        localStorage.setItem('directAccess', 'true')
        
        // Navigate based on the next step
        if (data.next === 'gp-verify-phone') {
          navigate("/gp-verify-phone")
        } else {
          navigate("/gp-platform")
        }
      } else {
        setError(data.message || "Sign in failed. Please try again.")
      }
    } catch (err) {
      setError("Connection error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side with animations */}
      <div className="hidden lg:flex lg:w-1/2 bg-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Limitless
          </h1>
        </div>

        <div className="relative h-96 z-0">
          {/* Animated circles */}
          <motion.svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M0,50 C20,20 50,70 100,50 L100,100 L0,100 Z"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 1,
                d: [
                  "M0,50 C20,20 50,70 100,50 L100,100 L0,100 Z",
                  "M0,50 C50,30 80,80 100,50 L100,100 L0,100 Z",
                  "M0,50 C20,20 50,70 100,50 L100,100 L0,100 Z",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.svg>
        </div>

        <div className="space-y-4 z-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 max-w-md">
            Sign in to your GP account to manage your investment opportunities and connect with accredited investors.
          </p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 bg-white p-6 md:p-12 flex items-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="lg:hidden space-y-4 mb-8">
            <h1 className="text-3xl font-bold">Limitless</h1>
            <h2 className="text-3xl font-bold">Sign in to your GP account</h2>
            <p className="text-gray-600">Access your investment opportunities and investor network.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 border-gray-300 focus:border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12 border-gray-300 focus:border-gray-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <span>Sign in</span>
                  <motion.div
                    className="ml-2 inline-flex"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/direct-signup-gp")}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 