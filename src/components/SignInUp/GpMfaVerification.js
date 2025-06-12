"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "../Common/button"
import { Input } from "../Common/input"
import { Label } from "../Common/label"
import { useNavigate } from "react-router-dom"

export const GpMfaVerification = () => {
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(30)
  const navigate = useNavigate()
  
  // Check if this is a direct access flow
  const isDirectFlow = localStorage.getItem('directAccess') === 'true'

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendCode = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/request-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: localStorage.getItem('gp_userEmail'),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setCountdown(30)
      } else {
        setError(data.message || "Failed to resend code")
      }
    } catch (err) {
      setError("Connection error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const sendWelcomeEmail = (email, firstName) => {
    fetch("https://limitless-backend.vercel.app/api/send-welcome-email", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        firstName: firstName,
        lastName: ""
      }),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const email = localStorage.getItem('gp_userEmail');
    const firstName = localStorage.getItem('gp_userName');

    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/gp-verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          verification_code: verificationCode,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // For direct access flow, go straight to dashboard
        sendWelcomeEmail(email, firstName);
        if (isDirectFlow) {
          localStorage.removeItem('directAccess') // Clear the flag
          navigate("/gp-dashboard")
        } else {
          navigate("/welcome") // Regular waitlist flow
        }
      } else {
        setError(data.message || "Invalid verification code")
      }
    } catch (err) {
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent font-freight">
              Verify Your Identity
            </h1>
            <p className="text-gray-600 font-freight">
              Please enter the 6-digit verification code sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                placeholder="Enter 6-digit code"
                className="h-12 border-gray-300 focus:border-gray-500 text-center text-2xl tracking-wider font-freight"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={verificationCode.length !== 6 || isLoading}
              className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white transition-all duration-300 shadow-md hover:shadow-lg font-freight"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
              <motion.div
                className="ml-2 inline-flex"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0 || isLoading}
                className="text-sm text-blue-500 hover:text-blue-600 disabled:text-gray-400"
              >
                {countdown > 0 
                  ? `Resend code in ${countdown}s` 
                  : "Resend verification code"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-12 flex-col justify-between">
        <div className="z-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent font-freight">
            Welcome to Limitless
          </h2>
          <p className="text-gray-600 mt-4 max-w-md font-freight">
            We&apos;re excited to have you join our platform. Just one more step to access your exclusive LP dashboard.
          </p>
        </div>
      </div>
    </div>
  )
} 