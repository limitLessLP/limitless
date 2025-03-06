"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logoBlack from '../assets/logoBlack.png'

export default function Navbar({ scrolled }) {
  const navigate = useNavigate()
  const [openDropdown, setOpenDropdown] = useState(null)

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

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md' : ''}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <img src={logoBlack} alt="LimitLess" className="h-8 w-auto" />
          
          {/* Resources Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdownClick('resources')}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Resources
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openDropdown === 'resources' ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {openDropdown === 'resources' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden"
                >
                  {resourcesItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        navigate(item.href)
                        setOpenDropdown(null)
                      }}
                      className="block w-full px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-300 
                               hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
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
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Company
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openDropdown === 'company' ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {openDropdown === 'company' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden"
                >
                  {companyItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        navigate(item.href)
                        setOpenDropdown(null)
                      }}
                      className="block w-full px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-300 
                               hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
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
          onClick={() => navigate('/select-type')}
          className="group relative bg-gradient-to-b from-black/10 to-white/10 
                    dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                    overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <span className="inline-block px-6 py-2 rounded-[1.15rem] text-sm font-semibold 
                         backdrop-blur-md bg-white/95 hover:bg-white/100 dark:bg-black/95 
                         dark:hover:bg-black/100 text-black dark:text-white transition-all 
                         duration-300 group-hover:-translate-y-0.5">
            Get Started
          </span>
        </button>
      </div>
    </nav>
  )
} 