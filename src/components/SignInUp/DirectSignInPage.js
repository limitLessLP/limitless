"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../Common/button"
import { Input } from "../Common/input"
import { Label } from "../Common/label"

// Temporary bypass for testing - remove in production
const BYPASS_VERIFICATION = true; 

export const DirectSignInPage = () => {
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

    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()
      console.log("Sign-in response:", data) // Debug log

      if (data.success) {
        // Store the authentication token
        localStorage.setItem('token', data.token || data.accessToken || '')
        // Store user's name and email for dashboard
        localStorage.setItem('userName', data.firstName || data.user?.firstName || data.name || 'Investor')
        localStorage.setItem('userEmail', email)
        
        // For debugging - log all possible verification fields
        console.log("Verification status check:", {
          verified: data.verified,
          isVerified: data.isVerified,
          phoneVerified: data.phoneVerified,
          user_verified: data.user?.verified,
        })
        
        // Temporarily bypass verification check for testing
        if (BYPASS_VERIFICATION) {
          console.log("Verification bypass enabled - going directly to dashboard")
          navigate("/dashboard")
          return;
        }
        
        // Check multiple possible verification fields (API might use different field names)
        const isUserVerified = data.verified || data.isVerified || data.phoneVerified || data.user?.verified || false
        
        if (isUserVerified) {
          console.log("User is verified, going to dashboard")
          // If already verified, go straight to dashboard
          navigate("/dashboard")
        } else {
          console.log("User is not verified, requesting verification")
          // Need to complete verification
          localStorage.setItem('directAccess', 'true')
          
          // Request verification code and navigate to verification page
          try {
            const verificationResponse = await fetch('https://limitless-backend.vercel.app/api/request-verification', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email
              }),
            })
            
            const verificationData = await verificationResponse.json()
            console.log("Verification request response:", verificationData) // Debug log
            
            if (verificationResponse.ok) {
              navigate("/mfa-verification")
            } else {
              setError(verificationData.message || "Failed to send verification code. Please try again.")
            }
          } catch (verificationError) {
            console.error("Verification request error:", verificationError)
            setError("Error during verification request. Please try again.")
          }
        }
      } else {
        setError(data.message || "Invalid email or password")
      }
    } catch (err) {
      console.error("Sign-in error:", err)
      setError("Connection error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 bg-white p-6 md:p-12 flex items-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Limitless
            </h1>
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-gray-600">
              Sign in to access your premium investment opportunities
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-300 focus:border-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-blue-600"
                  onClick={() => navigate("/reset-password")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-300 focus:border-gray-500 pr-10"
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
                Don&apos;t have an account?{" "}
                <button 
                  type="button"
                  onClick={() => navigate("/direct-signup")}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-100 to-white p-12 flex-col justify-between">
        <div className="z-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Access Your Portfolio
          </h2>
          <p className="text-gray-600 mt-4 max-w-md">
            Sign in to access your premium investment opportunities and portfolio dashboard.
          </p>
        </div>
        
        {/* Animated element */}
        <div className="relative h-96 z-0">
          <motion.svg 
            className="absolute w-full h-full" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1, 
                rotate: 360 
              }}
              transition={{ 
                duration: 8, 
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "linear" 
              }}
            />
            <motion.path
              d="M20,50 Q50,20 80,50 Q50,80 20,50"
              fill="none"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                d: [
                  "M20,50 Q50,20 80,50 Q50,80 20,50",
                  "M20,60 Q60,30 80,60 Q60,90 20,60",
                  "M20,50 Q50,20 80,50 Q50,80 20,50",
                ]
              }}
              transition={{ 
                duration: 12, 
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut" 
              }}
            />
          </motion.svg>
        </div>
      </div>
    </div>
  )
} 