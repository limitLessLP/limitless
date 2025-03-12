"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Navbar({ section }) {
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null)
  const [scrolled, setScrolled] = useState(false)

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

  const resourcesItems = [
    { label: "Learn More - Investors", href: "/learn-more-investor" },
    { label: "Learn More - VCs", href: "/learn-more-vc" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ]

  const companyItems = [
    { label: "About Us", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" },
  ]

  const handleDropdownClick = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  // Get text color based on current section
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
          <div className="flex items-center gap-8">
            <h1 href="/" className={`text-2xl font-bold ${getTextColor()}`}>
              LimitLess
            </h1>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('resources')}
                className={`flex items-center gap-1 text-sm ${getTextColor()} transition-colors`}
              >
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'resources' && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden"
                  >
                    {resourcesItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          navigate(item.href)
                          setOpenDropdown(null)
                        }}
                        className={`block w-full px-4 py-3 text-left text-sm text-black hover:text-black/80 dark:text-white dark:hover:text-white/80 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('company')}
                className={`flex items-center gap-1 text-sm ${getTextColor()} transition-colors`}
              >
                Company
                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'company' && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden"
                  >
                    {companyItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          navigate(item.href)
                          setOpenDropdown(null)
                        }}
                        className={`block w-full px-4 py-3 text-left text-sm text-black hover:text-black/80 dark:text-white dark:hover:text-white/80 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={() => navigate("/select-type")}
            className={`group relative p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 
                      ${
                        section === "hero"
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-black text-white hover:bg-gray-900"
                      }`}
          >
            <span
              className="inline-block px-6 py-2 rounded-[1.15rem] text-sm font-semibold 
                           transition-all duration-300 group-hover:-translate-y-0.5"
            >
              Get Started
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

