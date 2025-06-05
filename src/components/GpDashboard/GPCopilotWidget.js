"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, MessageSquare, X, Send, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "../Common/button"
import { Input } from "../Common/input"
import { useNavigate } from "react-router-dom"

export const GPCopilotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateQuickResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsLoading(false)
    }, 1000)
  }

  const generateQuickResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('lp')) {
      return 'I can help with LP management. Click "Open Full Copilot" for detailed assistance.'
    } else if (lowerMessage.includes('deal')) {
      return 'For deal flow analysis, let&apos;s continue in the full copilot interface.'
    } else {
      return 'I can assist with that! For a better experience, try the full GP Copilot.'
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
        >
          <Bot className="h-6 w-6" />
        </motion.button>
      )}

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-medium">GP Copilot</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:text-gray-200"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm">
                      <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>Hi! I&apos;m your GP Copilot.</p>
                      <p>Ask me anything about fund management!</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-lg p-2 text-sm ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 text-sm"
                      disabled={isLoading}
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </form>
                  
                  {/* Full Copilot Button */}
                  <button
                    onClick={() => navigate('/gp-copilot')}
                    className="w-full mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Open Full Copilot
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default GPCopilotWidget 