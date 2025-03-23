"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "../Common/button"
import { Input } from "../Common/input"
import { Label } from "../Common/label"
import { useNavigate } from "react-router-dom"

export const SignUpPage = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Store name for welcome animation
    localStorage.setItem('userName', firstName)
    navigate("/mfa-verification")
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 bg-white p-6 md:p-12 flex items-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-extralight mb-8">
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-700/80 bg-clip-text text-transparent">
                Create your account
              </span>
            </h1>
            <p className="text-gray-600">
              Join Limitless and experience financial freedom with complete transparency and premium service.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  className="h-12"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  className="h-12"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                className="h-12"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="h-12"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <p className="text-sm text-gray-500">Must be at least 8 characters</p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-black text-white hover:bg-gray-900 transition-colors"
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Background animation from landing page */}
      </div>
    </div>
  )
}