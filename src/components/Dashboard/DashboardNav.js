import { Bell } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const DashboardNav = ({ currentPage }) => {
  const userName = localStorage.getItem('userName') || 'Investor'
  const navigate = useNavigate()

  const getNavClass = (page) => {
    return currentPage === page ? 'border-b-2 border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
  }

  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="#" onClick={() => navigate('/dashboard')} className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                Limitless
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="#" onClick={() => navigate('/dashboard')} className={`${getNavClass('dashboard')} inline-flex items-center px-1 pt-1 text-sm font-medium`}>
                Home
              </a>
              <a href="#" onClick={() => navigate('/offerings')} className={`${getNavClass('offerings')} inline-flex items-center px-1 pt-1 text-sm font-medium`}>
                Offerings
              </a>
              <a href="#" onClick={() => navigate('/lp-portfolio')} className={`${getNavClass('lp-portfolio')} inline-flex items-center px-1 pt-1 text-sm font-medium`}>
                Portfolio
              </a>
            </div>
          </div>
          <div className="flex items-center relative">
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700">
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-3 relative group">
              <button 
                className="p-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none" 
                id="user-menu-button"
                onClick={() => setShowMenu(!showMenu)}>
                {userName[0]}
              </button>
              {showMenu && 
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10" id="user-menu">
                <a href="#" onClick={() => navigate('/profile')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                {/* <a href="#" onClick={() => navigate('/settings')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a> */}
                <a href="#" onClick={() => { localStorage.clear(); navigate('/'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign Out
                </a>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}