"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Menu, X } from "lucide-react"

export function Navbar({ section }) {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
      className={`${isMobile? '': "fixed"} top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Logo + Desktop Links */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className={`text-2xl font-bold ${getTextColor()}`}
            >
              Limitless
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 relative">
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
                      Retail Investors
                    </button>
                    <button
                      onClick={() => {
                        navigate("/learn-more-gp")
                        setDropdownOpen(false)
                      }}
                      className="rounded-b-xl block w-full text-left px-4 py-3 text-sm text-black hover:bg-black hover:text-white transition-colors"
                    >
                      VC Partners
                    </button>
                  </div>
                )}
              </div>

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
              <button
                onClick={() => navigate("/portco-signin")}
                className={`text-sm ${getTextColor()} transition-colors`}
              >
                Portfolio Company
              </button>
            </div>
          </div>

          {/* Right side: Get Started + Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Direct LP Access Button */}
            <button
              onClick={() => navigate("/access-type")}
              className={`hidden md:block group relative p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 
                ${
                  section === "hero"
                    ? "bg-transparent border border-white text-white hover:bg-white/10"
                    : "bg-transparent border border-black text-black dark:border-white dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                }`}
            >
              <span className="inline-block px-6 py-2 rounded-[1.15rem] text-sm font-semibold transition-all duration-300 group-hover:-translate-y-0.5">
                Early Access
              </span>
            </button>
            
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

            {/* Hamburger Menu (Mobile only) */}
            <button
              className={`md:hidden ${getTextColor()}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-black/90 backdrop-blur-md rounded-xl p-4 text-white">
            <button
              onClick={() => {
                navigate("/learn-more-investor")
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-sm py-2 hover:text-gray-300"
            >
              Retail Investors
            </button>
            <button
              onClick={() => {
                navigate("/learn-more-gp")
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-sm py-2 hover:text-gray-300"
            >
              VC Partners
            </button>
            <button
              onClick={() => {
                navigate("/about")
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-sm py-2 hover:text-gray-300"
            >
              About Us
            </button>
            <button
              onClick={() => {
                navigate("/faq")
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-sm py-2 hover:text-gray-300"
            >
              FAQ
            </button>
            <button
              onClick={() => {
                navigate("/access-type")
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-sm py-2 hover:text-gray-300"
            >
              Early Access
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}