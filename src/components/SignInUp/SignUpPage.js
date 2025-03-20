"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "../Common/button"
import { Input } from "../Common/input"
import { Label } from "../Common/label"
import { useNavigate } from "react-router-dom"
import { TrendAnimation } from "./TrendAnimation"

export const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [firmName, setFirmName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [position, setPosition] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  function isAllFieldsEmpty(...fields) {
    return fields.every(field => !field.trim())
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side with animations */}
      <div className="hidden lg:flex lg:w-1/2 bg-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <button
            onClick={() => {
              if (isAllFieldsEmpty(firmName, firstName, lastName, position, businessEmail, phone, password)) {
                navigate("/")
              } else {
                const confirmed = window.confirm("Discard unsaved changes?")
                if (confirmed) {
                  navigate("/")
                }
              }
            }}
            className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
          >
            Limitless
          </button>
        </div>

        <div className="space-y-2 z-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="text-gray-600 max-w-md">
            Join Limitless and experience financial freedom with complete transparency and premium service. Your journey
            starts here.
          </p>
        </div>

        <TrendAnimation />
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 bg-white p-6 md:p-12 flex items-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="lg:hidden space-y-4 mb-8">
            <h1 className="text-3xl font-bold">Limitless</h1>
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="text-gray-600">We&apos;ll need your name, contact information, and a secure password.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firmName">Firm Name</Label>
              <Input
                id="firmName"
                placeholder="Enter firm name"
                className="h-12 border-gray-300 focus:border-gray-500"
                required
                value={firmName}
                onChange={e => setFirmName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  className="h-12 border-gray-300 focus:border-gray-500"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  className="h-12 border-gray-300 focus:border-gray-500"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="e.g. Managing Partner"
                className="h-12 border-gray-300 focus:border-gray-500"
                required
                value={position}
                onChange={e => setPosition(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessEmail">Business Email</Label>
              <Input
                id="businessEmail"
                type="email"
                placeholder="you@example.com"
                className="h-12 border-gray-300 focus:border-gray-500"
                required
                value={businessEmail}
                onChange={e => setBusinessEmail(e.target.value)}
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
                onChange={e => setPhone(e.target.value)}
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
                  onChange={e => setPassword(e.target.value)}
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
              <span>Create Account</span>
              <motion.div
                className="ml-2 inline-flex"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}