export const Footer = () => {

    return (
        <footer
          id="footerRef"
          className="snap-start relative z-10 border-t border-white/10 h-screen flex items-center"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                © 2024 LimitLess.
              </div>
              <div className="flex gap-6">
              <a href="/terms" className="text-gray-400 hover:text-white transition text-sm">Terms</a>
              <a href="/privacy" className="text-gray-400 hover:text-white transition text-sm">Privacy</a>
              <a href="/contact" className="text-gray-400 hover:text-white transition text-sm">Contact</a>
              </div>
            </div>
          </div>
        </footer>
    )
}