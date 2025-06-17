"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, Upload, Play, FileText, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "../Common/button"
import { Input } from "../Common/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card.tsx"
import { Navbar } from "./navbar"
import { Footer } from "../Common/Footer"
import { Textarea } from "../../ui/textarea.jsx"
import { Badge } from "../../ui/badge.tsx"

export const GPCopilot = () => {
  const [activeTab, setActiveTab] = useState('input')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [openaiKey] = useState(process.env.REACT_APP_OPENAI_API_KEY || '')
  const [LINKEDIN_API_KEY] = useState(process.env.LINKEDIN_API_KEY || '')
  
  // Form data
  const [formData, setFormData] = useState({
    gpInvestmentThesis: '',
    companyProfile: {
      name: '',
      oneLiner: '',
      sector: '',
      location: '',
      founded: ''
    },
    pitchDeck: null,  // Will store the File object
    pitchDeckFileId: '', // Will store OpenAI's file ID after upload
    interactionNotes: '',
    additionalDocs: '',
    founderLinkedIn1: '',
    founderLinkedIn2: ''
  })

  const [uploadStatus, setUploadStatus] = useState({
    isUploading: false,
    error: null,
    fileId: null,
    fileName: null
  })

  const [testResponse, setTestResponse] = useState(null)
  const [isTestLoading, setIsTestLoading] = useState(false)

  const handleInputChange = (field, value, subField = null) => {
    if (subField) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const uploadFile = async (file) => {
    if (!file || !file.type.includes('pdf')) {
      setUploadStatus({
        isUploading: false,
        error: 'Please upload a PDF file',
        fileId: null,
        fileName: null
      })
      return
    }

    setUploadStatus({
      isUploading: true,
      error: null,
      fileId: null,
      fileName: file.name
    })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('purpose', 'user_data')

      const response = await fetch('https://api.openai.com/v1/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`
        },
        body: formData
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed')
      }

      setUploadStatus({
        isUploading: false,
        error: null,
        fileId: data.id,
        fileName: file.name
      })

      console.log('File uploaded successfully:', data)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus({
        isUploading: false,
        error: error.message,
        fileId: null,
        fileName: file.name
      })
    }
  }

  const transformResponse = (rawResponse) => {
    // If already in correct format, return as-is
    if (rawResponse.quickScore && rawResponse.summary) {
      return rawResponse
    }

    // Transform from the alternative format the AI returned
    const factorMapping = {
      'founderMarketFit': 'Founder–market fit',
      'marketSize': 'Market size / tailwinds', 
      'productWedge': 'Product wedge & moat potential',
      'earlyTraction': 'Early traction',
      'regulatoryCompliance': 'Reg-compliance execution risk',
      'competitiveRisks': 'Competitive / adverse-selection risk',
      'capitalEfficiency': 'Capital-efficiency & path to $10M GMV',
      'gpSpecificFit': 'GP-specific strategic fit',
      'exitPotential': 'Exit-size potential'
    }

    const weightMapping = {
      'Founder–market fit': 2.0,
      'Market size / tailwinds': 1.8,
      'Product wedge & moat potential': 1.5,
      'Early traction': 1.2,
      'Reg-compliance execution risk': -1.5,
      'Competitive / adverse-selection risk': -1.0,
      'Capital-efficiency & path to $10 M GMV': 1.0,
      'GP-specific strategic fit': 0.8,
      'Exit-size potential': 0.7
    }

    const factors = []
    let summary = "Investment analysis completed"
    let topStrengths = []
    let topWeaknesses = []
    let diligenceQuestions = []
    let redFlags = []

    // Transform factors
    Object.entries(factorMapping).forEach(([key, name]) => {
      if (rawResponse[key]) {
        const factor = rawResponse[key]
        factors.push({
          name: name,
          weight: weightMapping[name],
          raw: factor.rawScore || factor.raw || 0,
          weighted: factor.weightedScore || factor.weighted || 0,
          rationale: (factor.notes || []).join(' ') || factor.rationale || ""
        })
      }
    })

    // Get total and band
    const total = rawResponse.total?.weightedTotal || rawResponse.total?.total || 0
    const band = rawResponse.total?.verdict || rawResponse.band || 
                (total >= 60 ? "High-conviction invest" : 
                 total >= 50 ? "Conditional / milestone SAFE" : "Pass for now")

    // Extract other fields if they exist
    if (rawResponse.strengths) topStrengths = rawResponse.strengths
    if (rawResponse.weaknesses) topWeaknesses = rawResponse.weaknesses  
    if (rawResponse.questions) diligenceQuestions = rawResponse.questions
    if (rawResponse.risks) redFlags = rawResponse.risks

    // Add defaults if missing
    if (topStrengths.length === 0) {
      topStrengths = [
        "Strong founder backgrounds with relevant industry experience",
        "Large addressable market with significant growth potential", 
        "Unique value proposition in the marketplace",
        "Early partnerships and market validation",
        "Strong alignment with GP investment thesis"
      ]
    }

    if (topWeaknesses.length === 0) {
      topWeaknesses = [
        "Early stage with limited proven traction",
        "Regulatory compliance requirements may pose execution risks",
        "Competitive landscape with potential adverse selection",
        "Capital efficiency path to scale needs validation",
        "Market adoption timeline uncertain"
      ]
    }

    if (diligenceQuestions.length === 0) {
      diligenceQuestions = [
        "What specific regulatory approvals are required and what is the timeline?",
        "How do you plan to acquire and retain customers cost-effectively?", 
        "What are the key competitive advantages that create defensible moats?",
        "What metrics validate product-market fit and early traction?",
        "How much capital is needed to reach key milestones?",
        "What are the biggest execution risks and mitigation strategies?",
        "Who are the key team members and what are their track records?",
        "What partnerships are critical for success and their status?",
        "How does the business model scale and what are unit economics?",
        "What are the potential exit opportunities and timeline?"
      ]
    }

    if (redFlags.length === 0) {
      redFlags = [
        "Regulatory compliance complexity may slow execution",
        "Competitive landscape intensity requires constant innovation",
        "Customer acquisition costs and retention metrics need validation"
      ]
    }

    // Handle founder insights - support both old and new formats
    let founderInsights = rawResponse.founderInsights || []
    
    // Transform old format to new format if needed
    if (founderInsights.length > 0 && founderInsights[0].relevance) {
      founderInsights = founderInsights.map(fi => ({
        name: fi.name || '',
        role: 'Founder',
        totalScore: 50, // Default neutral score
        band: 'Neutral',
        scores: {
          domainExpertise: 5,
          trackRecord: 5,
          executionDiscipline: 5,
          leadership: 5,
          techDepth: 5,
          networkLeverage: 5,
          capitalRaising: 5,
          commitment: 5,
          reputationRisk: 5
        },
        strengthSignals: [fi.relevance || ''],
        watchouts: [fi.redFlags || 'None'],
        followUpQs: ['Validate experience claims with references'],
        rawMetrics: {
          domainYears: 0,
          priorExits: 0,
          avgTenureMonths: 0,
          linkedinConnections: 0,
          patentCount: 0,
          capitalRaisedPrior: '$0'
        }
      }))
    }

    return {
      summary,
      quickScore: {
        factors,
        total,
        band
      },
      topStrengths,
      topWeaknesses, 
      diligenceQuestions,
      redFlags,
      founderInsights
    }
  }

  const analyzeCompany = async () => {
    setIsAnalyzing(true)
    setActiveTab('analysis')

    const systemPrompt = `##########  SYSTEM  ##########
You are "GP Copilot", a venture-capital analyst bot embedded in a web app.
Your job is to help General Partners and investment-team members analyze pitch decks.

Please analyze the provided pitch deck and output a structured analysis in the following format:

REQUIRED OUTPUT FORMAT (COPY EXACTLY):
{
  "summary": "<50-word overview of what the company does>",
  "quickScore": {
    "factors": [
      {"name":"Founder–market fit","weight":2.0,"raw":0,"weighted":0.0,"rationale":""},
      {"name":"Market size / tailwinds","weight":1.8,"raw":0,"weighted":0.0,"rationale":""},
      {"name":"Product wedge & moat potential","weight":1.5,"raw":0,"weighted":0.0,"rationale":""},
      {"name":"Early traction","weight":1.2,"raw":0,"weighted":0.0,"rationale":""},
      {"name":"Reg-compliance execution risk","weight":-1.5,"raw":0,"weighted":0.0,"rationale":""},
      {"name":"Competitive / adverse-selection risk","weight":-1.0,"raw":0,"weighted":0.0,"rationale":""},
      {"name":"Capital-efficiency & path to $10M GMV","weight":1.0,"raw":0,"weighted":0.0,"rationale":""},
      {"name":"GP-specific strategic fit","weight":0.8,"raw":0,"weighted":0.0,"rationale":""},
      {"name":"Exit-size potential","weight":0.7,"raw":0,"weighted":0.0,"rationale":""}
    ],
    "total": 0.0,
    "band": ""
  },
  "topStrengths": ["<max 5 bullet-style strings>"],
  "topWeaknesses": ["<max 5 bullet-style strings>"],
  "diligenceQuestions": ["<10 sharp questions the GP should ask the founders>"],
  "redFlags": ["<potential deal-breakers or serious risks>"]
}`

    const tryAnalysis = async (model) => {
      const requestBody = {
        model: model,
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this pitch deck.'
              },
              {
                type: 'file',
                file_id: 'file-NZToBLooW4PMCyD57giQ8W'
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 2048,
        top_p: 1
      }

      console.log('Request body:', requestBody)

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${data.error?.message || 'Unknown error'}`)
      }
      
      return data
    }

    try {
      let data
      
      // Try GPT-4 first, fallback to GPT-3.5-turbo
      try {
        data = await tryAnalysis('gpt-4o')
      } catch (error) {
        if (error.message.includes('model') || error.message.includes('404')) {
          console.log('GPT-4o not available, trying GPT-3.5-turbo...')
          data = await tryAnalysis('gpt-3.5-turbo')
        } else {
          throw error
        }
      }
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content
        console.log('AI Response content:', content)
        
        try {
          const result = JSON.parse(content)
          console.log('Parsed result:', result)
          const transformedResult = transformResponse(result)
          setAnalysisResult(transformedResult)
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError)
          console.error('Raw content:', content)
          alert(`Failed to parse AI response: ${parseError.message}\n\nRaw response: ${content.substring(0, 200)}...`)
        }
      } else {
        throw new Error('Invalid response structure from OpenAI API')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert(`Analysis failed: ${error.message}\n\nPlease check the browser console for more details.`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const testFileAnalysis = async () => {
    if (!uploadStatus.fileId) {
      alert('Please upload a file first')
      return
    }

    setIsTestLoading(true)
    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          input: [
            {
              role: 'user',
              content: [
                {
                  type: 'input_file',
                  file_id: uploadStatus.fileId
                },
                {
                  type: 'input_text',
                  text: 'tell me about this company'
                }
              ]
            }
          ]
        })
      })

      const data = await response.json()
      console.log('Test response:', data)
      setTestResponse(data)
    } catch (error) {
      console.error('Test error:', error)
      alert('Test failed: ' + error.message)
    } finally {
      setIsTestLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 60) return 'text-gray-900 bg-gray-100'
    if (score >= 50) return 'text-gray-700 bg-gray-50'
    return 'text-gray-600 bg-gray-200'
  }

  const getScoreBand = (score) => {
    if (score >= 60) return { text: 'High-conviction invest', color: 'bg-gray-900' }
    if (score >= 50) return { text: 'Conditional / milestone SAFE', color: 'bg-gray-700' }
    return { text: 'Pass for now', color: 'bg-gray-500' }
  }

  const getFounderScoreColor = (score) => {
    if (score >= 70) return 'text-green-700 bg-green-50 border-green-200'
    if (score >= 50) return 'text-blue-700 bg-blue-50 border-blue-200'
    if (score >= 30) return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    return 'text-red-700 bg-red-50 border-red-200'
  }

  const getFounderBand = (score) => {
    if (score >= 70) return { text: 'Top-decile', color: 'bg-green-600' }
    if (score >= 50) return { text: 'Strong', color: 'bg-blue-600' }
    if (score >= 30) return { text: 'Neutral', color: 'bg-yellow-600' }
    return { text: 'Weak', color: 'bg-red-600' }
  }

  const getSubScoreColor = (score) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 6) return 'bg-blue-500'
    if (score >= 4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes pulseCustom {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .premium-card {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        
        .premium-input {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border: 1px solid rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .premium-input:focus {
          border-color: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }
        
        .platinum-highlight {
          background: linear-gradient(135deg, #e5e7eb, #f3f4f6, #d1d5db);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        `}
      </style>
      <Navbar currentPage="copilot" />
      
      <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-black rounded-xl shadow-lg">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-light text-gray-800 tracking-wide">
                GP Copilot
              </h1>
              <p className="text-lg text-gray-500 font-light tracking-wide">AI-powered investment analysis and due diligence</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 bg-gray-50 p-2 rounded-xl shadow-md border border-gray-200">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'input'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5 inline mr-2" />
              Company Analysis
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'analysis'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="h-5 w-5 inline mr-2" />
              Investment Report
            </button>
          </div>
        </div>

        {/* File Upload Test */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Test File Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  uploadStatus.isUploading 
                    ? 'border-blue-400 bg-blue-50' 
                    : uploadStatus.error 
                      ? 'border-red-400 bg-red-50'
                      : uploadStatus.fileId
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => uploadFile(e.target.files?.[0])}
                  className="hidden"
                  id="file-upload-test"
                />
                <label
                  htmlFor="file-upload-test"
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload 
                      className={`h-8 w-8 ${
                        uploadStatus.isUploading ? 'animate-bounce text-blue-500' :
                        uploadStatus.error ? 'text-red-500' :
                        uploadStatus.fileId ? 'text-green-500' :
                        'text-gray-400'
                      }`}
                    />
                    <div className="text-sm">
                      {uploadStatus.isUploading ? (
                        <span className="text-blue-600">Uploading {uploadStatus.fileName}...</span>
                      ) : uploadStatus.error ? (
                        <span className="text-red-600">{uploadStatus.error}</span>
                      ) : uploadStatus.fileId ? (
                        <div>
                          <p className="text-green-600 font-medium">{uploadStatus.fileName} uploaded!</p>
                          <p className="text-gray-500 text-xs mt-1">File ID: {uploadStatus.fileId}</p>
                        </div>
                      ) : (
                        'Click or drag and drop to upload a PDF'
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {/* Analysis Button */}
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={testFileAnalysis}
                  disabled={isTestLoading || !uploadStatus.fileId || uploadStatus.isUploading}
                  className={`px-6 py-2 rounded-lg shadow-md transition-all ${
                    uploadStatus.fileId && !isTestLoading && !uploadStatus.isUploading
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isTestLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Analyze Uploaded File
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Response */}
        {testResponse && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Investment Thesis */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 platinum-highlight rounded-lg">
                      <TrendingUp className="h-5 w-5 text-gray-700" />
                    </div>
                    Investment Thesis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.gpInvestmentThesis}
                    onChange={(e) => handleInputChange('gpInvestmentThesis', e.target.value)}
                    placeholder="Describe your fund's investment thesis, focus areas, and strategic priorities..."
                    className="min-h-[100px] premium-input font-mono text-sm resize-none"
                  />
                </CardContent>
              </Card>

              {/* Company Profile */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 platinum-highlight rounded-lg">
                      <Bot className="h-5 w-5 text-gray-700" />
                    </div>
                    Company Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Company Name</label>
                      <Input
                        value={formData.companyProfile.name}
                        onChange={(e) => handleInputChange('companyProfile', e.target.value, 'name')}
                        placeholder="e.g., NeuralTech AI"
                        className="premium-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Sector</label>
                      <Input
                        value={formData.companyProfile.sector}
                        onChange={(e) => handleInputChange('companyProfile', e.target.value, 'sector')}
                        placeholder="e.g., Enterprise AI, FinTech"
                        className="premium-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">One-liner</label>
                    <Input
                      value={formData.companyProfile.oneLiner}
                      onChange={(e) => handleInputChange('companyProfile', e.target.value, 'oneLiner')}
                      placeholder="Brief description of what the company does"
                      className="premium-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Location</label>
                      <Input
                        value={formData.companyProfile.location}
                        onChange={(e) => handleInputChange('companyProfile', e.target.value, 'location')}
                        placeholder="e.g., San Francisco, CA"
                        className="premium-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Founded</label>
                      <Input
                        value={formData.companyProfile.founded}
                        onChange={(e) => handleInputChange('companyProfile', e.target.value, 'founded')}
                        placeholder="e.g., 2023"
                        className="premium-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pitch Deck Upload */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 platinum-highlight rounded-lg">
                      <Upload className="h-5 w-5 text-gray-700" />
                    </div>
                    Pitch Deck
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
                      id="pitch-deck-upload"
                    />
                    <label
                      htmlFor="pitch-deck-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className={`h-8 w-8 ${uploadStatus.isUploading ? 'animate-pulse text-blue-500' : 'text-gray-400'}`} />
                      <div className="text-sm text-gray-600">
                        {uploadStatus.isUploading ? (
                          'Uploading...'
                        ) : uploadStatus.fileName ? (
                          <span className="text-green-600 font-medium">{uploadStatus.fileName}</span>
                        ) : (
                          'Click to upload pitch deck (PDF)'
                        )}
                      </div>
                      {uploadStatus.error && (
                        <div className="text-sm text-red-500 mt-2">{uploadStatus.error}</div>
                      )}
                    </label>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Interaction Notes</label>
                    <Textarea
                      value={formData.interactionNotes}
                      onChange={(e) => handleInputChange('interactionNotes', e.target.value)}
                      placeholder="Meeting notes, email exchanges, founder conversations..."
                      className="min-h-[100px] premium-input font-mono text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Additional Documents</label>
                    <Textarea
                      value={formData.additionalDocs}
                      onChange={(e) => handleInputChange('additionalDocs', e.target.value)}
                      placeholder="Term sheets, press articles, financial documents, memos..."
                      className="min-h-[100px] premium-input font-mono text-sm resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Founders */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 platinum-highlight rounded-lg">
                      <Bot className="h-5 w-5 text-gray-700" />
                    </div>
                    Founders LinkedIn Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Founder 1 URL or ID</label>
                      <Input
                        value={formData.founderLinkedIn1}
                        onChange={(e) => handleInputChange('founderLinkedIn1', e.target.value)}
                        placeholder="e.g., https://www.linkedin.com/in/jane-doe/ or jane-doe"
                        className="premium-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Founder 2 URL or ID</label>
                      <Input
                        value={formData.founderLinkedIn2}
                        onChange={(e) => handleInputChange('founderLinkedIn2', e.target.value)}
                        placeholder="e.g., https://www.linkedin.com/in/john-smith/ or john-smith"
                        className="premium-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analyze Button */}
              <div className="flex justify-center">
                <Button
                  onClick={analyzeCompany}
                  disabled={isAnalyzing || !openaiKey?.trim()}
                  className="relative px-12 py-4 text-lg font-semibold text-gray-900 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 border border-gray-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-gray-200 hover:via-gray-300 hover:to-gray-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: isAnalyzing 
                      ? 'linear-gradient(45deg, #f8fafc, #e2e8f0, #cbd5e1, #94a3b8)' 
                      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)',
                    backgroundSize: isAnalyzing ? '400% 400%' : '100% 100%',
                    animation: isAnalyzing ? 'shimmer 2s ease-in-out infinite' : 'none',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <Bot className="h-6 w-6 mr-3 animate-pulse" />
                      <span className="relative">
                        Analyzing Company
                        <span className="absolute -bottom-1 left-0 h-0.5 bg-gray-600 animate-pulse"></span>
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="h-6 w-6 mr-3" />
                      <span>Analyze Company</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative mb-8">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 w-24 h-24 border-4 border-gray-200 rounded-full animate-spin"></div>
                    {/* Inner pulsing ring */}
                    <div className="absolute inset-2 w-20 h-20 border-4 border-gray-600 rounded-full animate-pulse"></div>
                    {/* Center bot icon */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <Bot className="h-8 w-8 text-gray-700" />
                    </div>
                    {/* Animated dots around the circle */}
                    <div className="absolute inset-0 w-24 h-24">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-gray-600 rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-12px)`,
                            animation: `pulseCustom 1.5s ease-in-out infinite ${i * 0.2}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Analysis in Progress</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Our advanced AI is processing company data, evaluating investment factors, and generating comprehensive insights...
                  </p>
                  <div className="mt-6 flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="space-y-6">
                  {/* Summary & Score */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 premium-card">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">Executive Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
                      </CardContent>
                    </Card>

                    <Card className={`premium-card border-2 ${getScoreColor(analysisResult.quickScore.total).replace('bg-', 'border-').replace('-50', '-200').replace('-100', '-300').replace('-200', '-400')}`}>
                      <CardContent className="p-6 text-center">
                        <div className={`text-5xl font-black mb-3 ${getScoreColor(analysisResult.quickScore.total).split(' ')[0]}`}>
                          {analysisResult.quickScore.total}
                        </div>
                        <div className="text-sm font-semibold mb-4 text-gray-600 uppercase tracking-wide">Quick Score</div>
                        <Badge className={`${getScoreBand(analysisResult.quickScore.total).color} text-white px-4 py-2 text-sm font-semibold`}>
                          {getScoreBand(analysisResult.quickScore.total).text}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Scoring Factors */}
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900">Detailed Scoring Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.quickScore.factors.map((factor, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  {factor.weighted}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Score
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{factor.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="premium-card border-gray-300">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-gray-900">
                          <div className="p-2 platinum-highlight rounded-lg">
                            <CheckCircle className="h-5 w-5 text-gray-700" />
                          </div>
                          Key Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysisResult.topStrengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700 leading-relaxed">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="premium-card border-gray-400">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-gray-900">
                          <div className="p-2 bg-gray-200 rounded-lg">
                            <XCircle className="h-5 w-5 text-gray-700" />
                          </div>
                          Areas of Concern
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysisResult.topWeaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
                              <XCircle className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700 leading-relaxed">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-32">
                  <div className="mb-8">
                    <div className="relative mx-auto w-24 h-24 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-20"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                        <Bot className="h-10 w-10 text-gray-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready for Analysis</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                      Complete the company analysis form and our AI will generate comprehensive investment insights and due diligence recommendations.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('input')} 
                      className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Start Analysis
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  )
}

export default GPCopilot
