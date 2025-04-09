"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"

export function Navbar({ section }) {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  const getTextColor = () => {
    if (scrolled) return "text-white hover:text-white/80"
    switch (section) {
      case "hero":
        return "text-white hover:text-white/80"
      default:
        return "text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
    }
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Logo + Links */}
          <div className="flex items-center gap-24">
            <button
              onClick={() => navigate("/")}
              className={`text-2xl font-bold ${getTextColor()}`}
            >
              Limitless
            </button>

            {/* Navigation Links */}
            <div className="flex items-center gap-16 relative">
              {/* Learn More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1 text-sm ${getTextColor()} transition-colors`}
                >
                  Learn More
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full mt-2 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-lg ring-1 ring-black/10 dark:ring-white/10 z-10">
                    <button
                      onClick={() => {
                        navigate("/learn-more-investor")
                        setDropdownOpen(false)
                      }}
                      className="rounded-t-xl block w-full text-left px-4 py-3 text-sm text-black hover:bg-black hover:text-white transition-colors"
                    >
                      Investors
                    </button>
                    <button
                      onClick={() => {
                        navigate("/learn-more-gp")
                        setDropdownOpen(false)
                      }}
                      className="rounded-b-xl block w-full text-left px-4 py-3 text-sm text-black hover:bg-black hover:text-white transition-colors"
                    >
                      Partners
                    </button>
                  </div>
                )}
              </div>

              {/* Other standalone links */}
              <button
                onClick={() => navigate("/about")}
                className={`text-sm ${getTextColor()} transition-colors`}
              >
                About Us
              </button>
              <button
                onClick={() => navigate("/faq")}
                className={`text-sm ${getTextColor()} transition-colors`}
              >
                FAQ
              </button>
            </div>
          </div>

          {/* Get Started Button */}
          <button
            onClick={() => navigate("/select-type?for=waitlist")}
            className={`group relative p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 
              ${
                section === "hero"
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
          >
            <span className="inline-block px-6 py-2 rounded-[1.15rem] text-sm font-semibold transition-all duration-300 group-hover:-translate-y-0.5">
              Get Started
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}