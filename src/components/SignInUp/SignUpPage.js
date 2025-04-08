"use client"

import React from 'react';
import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "../Common/button"
import { Input } from "../Common/input"
import { Label } from "../Common/label"
import { useNavigate, Link } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const data = [
  { year: '2021', irr: 8.5 },
  { year: '2022', irr: 12.3 },
  { year: '2023', irr: 15.1 },
  { year: '2024', irr: 18.0 },
  { year: '2025', irr: 20.5 }
];

const FloatingIRRChart = () => {
  return (
      <div className="p-6 bg-white shadow-xl rounded-2xl w-full max-w-lg ml-3">
          <ResponsiveContainer width="90%" height={400}>
              <BarChart data={data}>
                  <XAxis dataKey="year" tick={{ display: 'none' }}/>
                  <YAxis tick={{ display: 'none' }}/>
                  <Bar
                      dataKey="irr"
                      shape={(props) => {
                          const { index, ...rest } = props;
                          return (
                              <motion.rect
                                  {...rest}
                                  style={{ transformOrigin: '50% 100%' }}
                                  fill="rgba(144,238,144,0.5)"  // Light green transparent fill
                                  stroke="black"               // Black border
                                  strokeWidth={1}
                                  animate={{ scaleY: [1, 1.05, 1] }}
                                  transition={{
                                      delay: index * 0.3, // Sequential animation delay
                                      duration: 1.5,
                                      repeat: Infinity,
                                      repeatType: "mirror",
                                      ease: "easeInOut"
                                  }}
                              />
                          );
                      }}
                  />
              </BarChart>
          </ResponsiveContainer>
      </div>
  );
};

export const SignUpPage = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [firmName, setFirmName] = useState("")
  const [firmPosition, setFirmPosition] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(window.location.search)
  const type = queryParams.get("type")
  const forPage = queryParams.get("for")

  const buttonText = ({ loadState }) => {
    if (forPage === "waitlist") {
      if (loadState) {
        return "Joining Waitlist...";
      }
      return "Join Waitlist";
    } else if (forPage === "account") {
      if (loadState) {
        return "Creating Account...";
      }
      return "Create Account";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const payload = {
      firstName,
      lastName,
      email,
      password,
      phone,
    }

    if (type === "gp") {
      payload.firm= firmName
      payload.position = firmPosition
    }

    try {
      let endpoint;
      if (forPage === "waitlist") {
        if (type === "gp") {
          endpoint = "https://limitless-backend.vercel.app/api/gp-waitlist";
        } else if (type === "lp") {
          endpoint = "https://limitless-backend.vercel.app/api/lp-waitlist";
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      console.log("Response data:", data); // Debugging line

      if (data.success) {
        localStorage.setItem('userName', firstName)
        localStorage.setItem('userEmail', email)
        navigate("/waitlist?success=true")
      } else {
        setError(data.message || "Sign up failed. Please try again.")
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
        <div className="absolute top-0 left-0 space-x-2 mb-4">
          <Link to="/select-type" className="flex items-center text-gray-600 hover:text-black py-4 px-4">
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-2">Back to Select Type</span>
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto space-y-8">
          {forPage === "account" &&
          <div>
            <h1 className="text-4xl font-extralight mb-8">
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-700/80 bg-clip-text text-transparent">
                Create your account
              </span>
            </h1>
            <p className="text-gray-600">
              Join Limitless and experience financial freedom with complete transparency and premium service.
            </p>
          </div>}

          {forPage === "waitlist" &&
          <div>
            <h1 className="text-4xl font-extralight mb-8">
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-700/80 bg-clip-text text-transparent">
                Sign up for waitlist
              </span>
            </h1>
            <p className="text-gray-600">
              Stay up to date with Limitless, and experience financial freedom with complete transparency and premium service.
            </p>
          </div>}

          <form className="space-y-6" onSubmit={handleSubmit}>

            {type === "gp" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firmName">Firm Name</Label>
                  <Input id="firmName" required value={firmName} onChange={e => setFirmName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firmPosition">Firm Position</Label>
                  <Input id="firmPosition" required value={firmPosition} onChange={e => setFirmPosition(e.target.value)} />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" required value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" required value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{type === "gp" ? "Firm" : ""} Email</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {forPage === "account" && 
            (<>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            </>)
            }

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button disabled={isLoading} className="w-full h-12 bg-black text-white flex items-center justify-center">
              {buttonText({ loadState: isLoading })}
              <ArrowRight className="ml-2 h-4 w-4 self-center" />
            </Button>
          </form>

          {forPage === "account" && 
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/signin" className="text-blue-500">Sign in</Link>
            </p>
          </div>}
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex-col justify-center items-center space-y-8">
        <span className="w-full text-center">
          <h2 className="text-3xl font-extralight text-gray-700">
            Access, transparency, opportunity
          </h2>
        </span>
        <FloatingIRRChart />
        <span className="w-full text-center">
          <h2 className="text-3xl font-extralight text-gray-700">
            This is venture capital without the velvet rope
          </h2>
        </span>
      </div>
    </div>
  )
}
