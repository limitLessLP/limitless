"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight, Building2 } from "lucide-react"
import { Button } from "../Common/button"
import { Input } from "../Common/input"
import { Label } from "../Common/label"
import { useNavigate } from "react-router-dom"
import { TrendAnimation } from "./TrendAnimation"

export const SignUpGPPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [firmName, setFirmName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [position, setPosition] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (
      !firmName.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !position.trim() ||
      !businessEmail.trim() ||
      !phone.trim() ||
      !password.trim()
    ) {
      setError("Please fill in all fields before proceeding.")
      return
    }
    setError("")
    setStep(2) // Move to MFA verification
  }

  function isAllFieldsEmpty(...fields) {
    return fields.every(field => !field.trim());
  }
  

  return (
    <div className="flex min-h-screen">
      {/* Left side with animations */}
      <div className="hidden lg:flex lg:w-1/2 bg-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <button
            onClick={() => {
              if (isAllFieldsEmpty(firmName, firstName, lastName, position, businessEmail, phone, password)) {
                navigate("/");
              } else {
                const confirmed = window.confirm("Discard unsaved changes?");
                if (confirmed) {
                  navigate("/");
                }
              }
            }}
            className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
          >
            Limitless
          </button>
        </div>

        <div className="space-y-4 z-10">
          <TrendAnimation />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Register Your VC Firm
          </h2>
          <p className="text-gray-600 max-w-md">
            Join Limitless to expand your investor base and streamline your operations with our premium platform.
          </p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 bg-white p-6 md:p-12 flex items-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="lg:hidden space-y-4 mb-8">
            <h1 className="text-3xl font-bold">Limitless</h1>
            <h2 className="text-3xl font-bold">Register Your VC Firm</h2>
            <p className="text-gray-600">We&apos;ll need some information about your firm and a secure password.</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="space-y-2">
                <Label htmlFor="firmName">Firm Name</Label>
                <Input
                  id="firmName"
                  placeholder="Enter your firm's name"
                  className="h-12 border-gray-300 focus:border-gray-500"
                  required
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="Your first name"
                    className="h-12 border-gray-300 focus:border-gray-500"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Your last name"
                    className="h-12 border-gray-300 focus:border-gray-500"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position at Firm</Label>
                <Input
                  id="position"
                  placeholder="e.g. Managing Partner"
                  className="h-12 border-gray-300 focus:border-gray-500"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="you@yourfirm.com"
                  className="h-12 border-gray-300 focus:border-gray-500"
                  required
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  className="h-12 border-gray-300 focus:border-gray-500"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    className="h-12 border-gray-300 focus:border-gray-500 pr-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>Continue to Verification</span>
                <motion.div
                  className="ml-2 inline-flex"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already registered?{" "}
                  <button
                    onClick={() => navigate("/signin")}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <MFAVerification />
          )}
        </div>
      </div>
    </div>
  )
}

function MFAVerification() {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ]

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      
      if (value && index < 5) {
        inputRefs[index + 1].current.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current.focus()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Building2 className="w-12 h-12 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold mb-2">Verify Your Account</h2>
        <p className="text-gray-600">
          We&apos;ve sent a verification code to your email address. Please enter it below.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {verificationCode.map((digit, index) => (
          <Input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-lg font-bold border-gray-300 focus:border-gray-500"
          />
        ))}
      </div>

      <Button
        type="button"
        className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <span>Complete Verification</span>
        <motion.div
          className="ml-2 inline-flex"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" }}
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </Button>

      <p className="text-center text-sm text-gray-600">
        Didn&apos;t receive the code?{" "}
        <button className="text-blue-600 hover:underline">Resend</button>
      </p>
    </div>
  )
}