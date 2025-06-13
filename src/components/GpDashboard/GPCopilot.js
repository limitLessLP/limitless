"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Input } from "../Common/input"
import { Navbar } from "./navbar"
import { Footer } from "../Common/Footer"
import { Textarea } from "../../ui/textarea.jsx"

export const GPCopilot = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [openaiKey] = useState(process.env.REACT_APP_OPENAI_API_KEY || '')
  const [LINKEDIN_API_KEY] = useState(process.env.LINKEDIN_API_KEY || '')
  const [isExporting] = useState(false)
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
    if (!openaiKey?.trim()) {
      alert('OpenAI API key not found. Please ensure REACT_APP_OPENAI_API_KEY is set in your environment variables.')
      return
    }

    if (!formData.pitchDeckFileId) {
      alert('Please upload a pitch deck PDF first')
      return
    }

    setIsAnalyzing(true)

    // ----------------------
    // Fetch LinkedIn profiles (max 2) if user provided URLs/IDs
    // ----------------------

    const extractLinkId = (link) => {
      try {
        if (!link) return ''
        // If user pasted a public identifier directly
        if (!link.startsWith('http')) return link.replace(/\//g, '')
        const urlObj = new URL(link)
        const parts = urlObj.pathname.split('/')
        // last non-empty part is usually the public identifier
        return parts.filter(Boolean).pop()
      } catch (err) {
        console.warn('Failed to parse LinkedIn URL:', err.message)
        return ''
      }
    }

    const fetchLinkedInProfile = async (identifier) => {
      if (!identifier) return null
      const apiUrl = `https://api.scrapingdog.com/linkedin?api_key=${LINKEDIN_API_KEY}&type=profile&linkId=${identifier}&private=false`
      try {
        const resp = await fetch(apiUrl)
        if (!resp.ok) throw new Error(`Status ${resp.status}`)
        return await resp.json()
      } catch (err) {
        console.warn('LinkedIn fetch error:', err.message)
        return null
      }
    }

    // ----------------------
    // Extract quantitative founder metrics from LinkedIn profile
    // ----------------------
    const extractFounderMetrics = (profile) => {
      if (!profile || !Array.isArray(profile) || profile.length === 0) return {}
      
      const p = profile[0]  // LinkedIn API returns array with single profile
      const experience = p.experience || []
      const education = p.education || []
      
      // Domain expertise - sector keyword matching
      const sectorKeywords = {
        'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural', 'deep learning'],
        'fintech': ['fintech', 'financial', 'banking', 'payments', 'crypto', 'blockchain'],
        'enterprise': ['enterprise', 'b2b', 'saas', 'software', 'platform'],
        'healthcare': ['health', 'medical', 'pharma', 'biotech', 'clinical'],
        'robotics': ['robotics', 'automation', 'hardware', 'iot', 'embedded']
      }
      
      let domainYears = 0
      let highestDomainRole = 'IC'
      
      experience.forEach(exp => {
        const summary = (exp.summary || '').toLowerCase()
        const position = (exp.position || '').toLowerCase()
        const company = (exp.company_name || '').toLowerCase()
        
        // Calculate years (rough estimate)
        const duration = exp.duration || ''
        const years = duration.includes('year') ? parseInt(duration.match(/(\d+)\s*year/)?.[1] || '0') : 0
        const months = duration.includes('month') ? parseInt(duration.match(/(\d+)\s*month/)?.[1] || '0') : 0
        const totalYears = years + (months / 12)
        
        // Check domain relevance
        const text = `${summary} ${position} ${company}`
        const isDomainRelevant = Object.values(sectorKeywords).some(keywords => 
          keywords.some(keyword => text.includes(keyword))
        )
        
        if (isDomainRelevant) {
          domainYears += totalYears
          
          // Determine role level
          if (position.includes('ceo') || position.includes('founder') || position.includes('president')) {
            highestDomainRole = 'CEO/Founder'
          } else if (position.includes('cto') || position.includes('vp') || position.includes('director')) {
            highestDomainRole = 'Senior'
          } else if (position.includes('lead') || position.includes('manager') || position.includes('senior')) {
            highestDomainRole = 'Lead'
          }
        }
      })
      
      // Entrepreneurial track record
      let priorExits = 0
      let prevVCBackedStartups = 0
      const exitKeywords = ['acquired', 'exit', 'ipo', 'sold', 'merger']
      
      experience.forEach(exp => {
        const summary = (exp.summary || '').toLowerCase()
        const position = (exp.position || '').toLowerCase()
        
        if (position.includes('founder') || position.includes('co-founder')) {
          prevVCBackedStartups++
          
          if (exitKeywords.some(keyword => summary.includes(keyword))) {
            priorExits++
          }
        }
      })
      
      // Execution discipline
      const tenures = experience.map(exp => {
        const duration = exp.duration || ''
        const years = duration.includes('year') ? parseInt(duration.match(/(\d+)\s*year/)?.[1] || '0') : 0
        const months = duration.includes('month') ? parseInt(duration.match(/(\d+)\s*month/)?.[1] || '0') : 0
        return years * 12 + months
      }).filter(t => t > 0)
      
      const avgTenureMonths = tenures.length > 0 ? tenures.reduce((a, b) => a + b, 0) / tenures.length : 0
      const currentTenure = tenures[0] || 0  // Most recent
      
      // Leadership & team building
      let largestTeamManaged = 0
      let mgmtRolesHeld = 0
      
      experience.forEach(exp => {
        const position = (exp.position || '').toLowerCase()
        const summary = (exp.summary || '').toLowerCase()
        
        if (position.includes('manager') || position.includes('director') || position.includes('vp') || 
            position.includes('head') || position.includes('lead')) {
          mgmtRolesHeld++
          
          // Try to extract team size from summary
          const teamMatch = summary.match(/team of (\d+)/i) || summary.match(/(\d+) people/i)
          if (teamMatch) {
            const teamSize = parseInt(teamMatch[1])
            largestTeamManaged = Math.max(largestTeamManaged, teamSize)
          }
        }
      })
      
      // Technical depth
      const patentCount = 0  // Would need additional API
      const pubCount = 0     // Would need additional API
      const hasPhD = education.some(edu => 
        (edu.college_degree || '').toLowerCase().includes('phd') ||
        (edu.college_degree || '').toLowerCase().includes('doctorate')
      )
      
      // Network leverage
      const connections = parseInt((p.connections || '0').replace(/[^\d]/g, '')) || 0
      const followers = parseInt((p.followers || '0').replace(/[^\d]/g, '')) || 0
      
      // Capital raising (would need additional data)
      const capitalRaisedPrior = 0
      const numberOfRounds = 0
      
      return {
        domainYears: Math.round(domainYears * 10) / 10,
        highestDomainRole,
        priorExits,
        prevVCBackedStartups,
        avgTenureMonths: Math.round(avgTenureMonths),
        tenureCurrentStartupMonths: currentTenure,
        largestTeamManaged,
        mgmtRolesHeld,
        patentCount,
        pubCount,
        hasPhD,
        linkedinConnections: connections,
        followerCount: followers,
        capitalRaisedPrior,
        numberOfRounds,
        fullName: p.fullName || '',
        headline: p.headline || '',
        location: p.location || ''
      }
    }

    const founderProfiles = []
    const founderMetrics = []
    if (formData.founderLinkedIn1) {
      const id1 = extractLinkId(formData.founderLinkedIn1)
      const profile1 = await fetchLinkedInProfile(id1)
      if (profile1) {
        founderProfiles.push(profile1)
        founderMetrics.push(extractFounderMetrics(profile1))
      }
    }
    if (formData.founderLinkedIn2) {
      const id2 = extractLinkId(formData.founderLinkedIn2)
      const profile2 = await fetchLinkedInProfile(id2)
      if (profile2) {
        founderProfiles.push(profile2)
        founderMetrics.push(extractFounderMetrics(profile2))
      }
    }

    const systemPrompt = `##########  SYSTEM  ##########
You are "GP Copilot", a venture-capital analyst bot embedded in a web app.
Your job is to help General Partners and investment-team members
  • PRE-SCREEN deals before they talk to founders  
  • Surface *reasons to say NO* quickly  
  • Recommend the *most incisive questions* to ask if a call is scheduled  
  • Output a structured "Quick-Score Model" (0–100) based on the factors below.  

Scoring factors & default weights  
  ┌──────────────────────────────────────────────┬──────┐
  │ Founder–market fit                        │  2.0 │
  │ Market size / tailwinds                   │  1.8 │
  │ Product wedge & moat potential            │  1.5 │
  │ Early traction                            │  1.2 │
  │ Reg–compliance execution risk (NEGATIVE)  │ –1.5 │
  │ Competitive / adverse-selection risk      │ –1.0 │
  │ Capital-efficiency & path to $10 M GMV    │  1.0 │
  │ GP-specific strategic fit                 │  0.8 │
  │ Exit-size potential                       │  0.7 │
  └──────────────────────────────────────────────┴──────┘

Scoring bands  
  • ≥ 60 → "High-conviction invest"  
  • 50–59 → "Conditional / milestone SAFE"  
  • < 50 → "Pass for now"

You will receive:
1. A pitch deck PDF to analyze
2. Company profile data
3. GP investment thesis
4. Founder LinkedIn profiles and metrics

Please analyze all materials and provide a comprehensive investment analysis.

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
  "redFlags": ["<potential deal-breakers or serious risks>"],
  "founderInsights": [
    {
      "name": "",
      "role": "",
      "totalScore": 0,
      "band": "",
      "scores": {
        "domainExpertise": 0,
        "trackRecord": 0,
        "executionDiscipline": 0,
        "leadership": 0,
        "techDepth": 0,
        "networkLeverage": 0,
        "capitalRaising": 0,
        "commitment": 0,
        "reputationRisk": 0
      },
      "strengthSignals": [""],
      "watchouts": [""],
      "followUpQs": [""],
      "rawMetrics": {
        "domainYears": 0,
        "priorExits": 0,
        "avgTenureMonths": 0,
        "linkedinConnections": 0,
        "patentCount": 0,
        "capitalRaisedPrior": "$0"
      }
    }
  ]
}

CRITICAL RULES:
1. Return ONLY valid JSON matching the above structure EXACTLY
2. Each "raw" score: integer 0-10
3. Each "weighted" score: raw × weight, rounded to 1 decimal
4. "total": sum of all weighted scores, rounded to 1 decimal  
5. "band": "High-conviction invest" OR "Conditional / milestone SAFE" OR "Pass for now"
6. All arrays limited to stated maximums
7. NO markdown, NO comments, NO explanations outside the JSON

##########  USER  ##########`

    console.log('Starting analysis with data:', formData)
    console.log('Founder metrics extracted:', founderMetrics)
    console.log('Using API key:', openaiKey.substring(0, 10) + '...')

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
                text: `Please analyze this pitch deck and the following company information: ${JSON.stringify({
                  gpInvestmentThesis: formData.gpInvestmentThesis,
                  companyProfile: formData.companyProfile,
                  interactionNotes: formData.interactionNotes,
                  additionalDocs: formData.additionalDocs,
                  founderProfiles,
                  founderMetrics
                })}`
              },
              {
                type: 'file',
                file: {
                  file_id: formData.pitchDeckFileId
                }
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
          console.log('GPT-4 not available, trying GPT-3.5-turbo...')
          data = await tryAnalysis('gpt-3.5-turbo')
        } else {
          throw error
        }
      }
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content
        console.log('AI Response content:', content)
        
        try {
          // Clean the response - remove any markdown code block indicators and leading/trailing whitespace
          const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
          const result = JSON.parse(cleanContent)
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
      
      // More detailed error messaging
      if (error.message.includes('401')) {
        alert('Invalid API key. Please check your OpenAI API key and try again.')
      } else if (error.message.includes('429')) {
        alert('Rate limit exceeded. Please wait a moment and try again.')
      } else if (error.message.includes('403')) {
        alert('Access forbidden. Please check your API key permissions.')
      } else if (error.message.includes('CORS') || error.message.includes('Network') || error.name === 'TypeError') {
        alert('Network/CORS error. Direct browser calls to OpenAI API may be blocked.\n\nFor production use, implement this via your backend server.\n\nFor testing, try:\n1. Using a CORS proxy\n2. Browser extension to disable CORS\n3. Running in development mode')
      } else {
        alert(`Analysis failed: ${error.message}\n\nPlease check the browser console for more details.`)
      }
    } finally {
      setIsAnalyzing(false)
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
      formData.append('purpose', 'assistants')

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

      // Update form data with file ID
      setFormData(prev => ({
        ...prev,
        pitchDeckFileId: data.id
      }))

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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100">
      <style>
        {`
        .dashboard-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .dashboard-input {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          transition: all 0.3s ease;
        }
        
        .dashboard-input:focus {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }
        
        .dashboard-highlight {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .upload-area {
          background: rgba(15, 23, 42, 0.6);
          border: 1px dashed rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(15, 23, 42, 0.8);
        }
        `}
      </style>

      <Navbar currentPage="copilot" />
      
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Input Forms */}
          <div className="col-span-5 space-y-3">
            {/* Investment Thesis */}
            <div className="dashboard-card rounded-xl p-2.5">
              <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Investment Thesis
              </h2>
              <Textarea
                value={formData.gpInvestmentThesis}
                onChange={(e) => handleInputChange('gpInvestmentThesis', e.target.value)}
                placeholder="Describe your fund's investment thesis and strategic priorities..."
                className="dashboard-input min-h-[60px] w-full rounded-lg p-2 text-sm"
              />
            </div>

            {/* Company Profile - Pitch Deck Only */}
            <div className="dashboard-card rounded-xl p-2.5">
              <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                <svg className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Pitch Deck
              </h2>
              <div className="upload-area rounded-lg p-2.5">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e)}
                  className="hidden"
                  id="pitch-deck-upload"
                />
                <label
                  htmlFor="pitch-deck-upload"
                  className="cursor-pointer block"
                >
                  {!uploadStatus.fileId ? (
                    <div className="flex items-center gap-3 justify-center">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
            </div>
            <div>
                        <p className="text-sm font-medium text-gray-300">
                          {uploadStatus.isUploading ? 'Uploading...' : 'Upload Pitch Deck'}
                        </p>
                        <p className="text-xs text-gray-500">PDF format, max 32MB</p>
            </div>
          </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-300 truncate">
                          {uploadStatus.fileName}
                        </p>
                        <p className="text-xs text-gray-500">Ready for analysis</p>
                      </div>
                      <div className="flex items-center gap-1">
            <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            document.getElementById('pitch-deck-upload').click()
                          }}
                          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Replace file"
                        >
                          <svg className="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
            </button>
            <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setUploadStatus({
                              isUploading: false,
                              error: null,
                              fileId: null,
                              fileName: null
                            })
                            setFormData(prev => ({
                              ...prev,
                              pitchDeckFileId: ''
                            }))
                          }}
                          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Remove file"
                        >
                          <svg className="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
            </button>
          </div>
        </div>
                  )}
                </label>
                    </div>
                    </div>

            {/* Founder LinkedIn Profiles */}
            <div className="dashboard-card rounded-xl p-2.5">
              <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Founders
              </h2>
              <div className="grid grid-cols-2 gap-2">
                      <Input
                  value={formData.founderLinkedIn1}
                  onChange={(e) => handleInputChange('founderLinkedIn1', e.target.value)}
                  placeholder="Founder 1 LinkedIn URL"
                  className="dashboard-input rounded-lg p-1.5 text-sm"
                />
                      <Input
                  value={formData.founderLinkedIn2}
                  onChange={(e) => handleInputChange('founderLinkedIn2', e.target.value)}
                  placeholder="Founder 2 LinkedIn URL"
                  className="dashboard-input rounded-lg p-1.5 text-sm"
                      />
                    </div>
                  </div>

            {/* Notes & Comments */}
            <div className="dashboard-card rounded-xl p-2.5">
              <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Notes & Comments
              </h2>
              <div className="space-y-2">
                    <Textarea
                      value={formData.interactionNotes}
                      onChange={(e) => handleInputChange('interactionNotes', e.target.value)}
                  placeholder="Meeting notes, founder conversations..."
                  className="dashboard-input min-h-[50px] w-full rounded-lg p-1.5 text-sm"
                    />
                    <Textarea
                      value={formData.additionalDocs}
                      onChange={(e) => handleInputChange('additionalDocs', e.target.value)}
                  placeholder="Additional context, documents..."
                  className="dashboard-input min-h-[50px] w-full rounded-lg p-1.5 text-sm"
                    />
                  </div>
            </div>

              {/* Analyze Button */}
            <button
                  onClick={analyzeCompany}
                  disabled={isAnalyzing || !openaiKey?.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-2 font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Analyzing
                    </>
                  ) : (
                    <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run Analysis
                    </>
                  )}
            </button>
              </div>

          {/* Right Column - Analysis Results */}
          <div className="col-span-7">
              {isAnalyzing ? (
              <div className="dashboard-card rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4">
                    <svg className="h-8 w-8 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    </div>
                    </div>
                <h3 className="text-xl font-semibold mb-2">Running Analysis</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Our AI is analyzing the company data, evaluating metrics, and generating comprehensive insights...
                </p>
                </div>
              ) : analysisResult ? (
              <div className="space-y-4">
                  {/* Summary & Score */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 dashboard-card rounded-xl p-4">
                    <h3 className="text-base font-semibold mb-2">Executive Summary</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.summary}</p>
                  </div>

                  <div className={`dashboard-card rounded-xl p-4 border-2 ${
                    analysisResult.quickScore.total >= 60 ? 'border-green-500/30' :
                    analysisResult.quickScore.total >= 50 ? 'border-blue-500/30' :
                    'border-red-500/30'
                  }`}>
                    <div className="text-center">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-400">Quick Score</div>
                        <button
                          onClick={() => {}}
                          disabled={isExporting}
                          className="p-1.5 hover:bg-[#1E293B] rounded-lg transition-colors"
                          title="Download Report"
                        >
                          {isExporting ? (
                            <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          ) : (
                            <Download className="h-4 w-4 text-gray-400 hover:text-gray-200" />
                          )}
                        </button>
                      </div>
                      <div className={`text-4xl font-bold mb-2 ${
                        analysisResult.quickScore.total >= 60 ? 'text-green-400' :
                        analysisResult.quickScore.total >= 50 ? 'text-blue-400' :
                        'text-red-400'
                      }`}>
                          {analysisResult.quickScore.total}
                        </div>
                      <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        analysisResult.quickScore.total >= 60 ? 'bg-green-500/20 text-green-400' :
                        analysisResult.quickScore.total >= 50 ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {analysisResult.quickScore.band}
                      </div>
                    </div>
                  </div>
                  </div>

                  {/* Scoring Factors */}
                <div className="dashboard-card rounded-xl p-4">
                  <h3 className="text-base font-semibold mb-3">Scoring Breakdown</h3>
                      <div className="space-y-3">
                        {analysisResult.quickScore.factors.map((factor, index) => (
                      <div key={index} className="bg-[#1E293B] rounded-lg p-3 hover:bg-[#1E293B]/80 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-medium text-gray-200">{factor.name}</h4>
                              <div className="text-right">
                            <div className="font-mono text-xs font-medium text-gray-400">
                              {factor.raw} × {factor.weight} = <span className="text-gray-200">{factor.weighted}</span>
                                </div>
                              </div>
                            </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{factor.rationale}</p>
                          </div>
                        ))}
                      </div>
                </div>

                  {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="dashboard-card rounded-xl p-4">
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                          Key Strengths
                    </h3>
                    <ul className="space-y-2">
                          {analysisResult.topStrengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 bg-[#1E293B] rounded-lg p-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span className="text-sm text-gray-300">{strength}</span>
                            </li>
                          ))}
                        </ul>
                          </div>

                  <div className="dashboard-card rounded-xl p-4">
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                      <svg className="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                          Areas of Concern
                    </h3>
                    <ul className="space-y-2">
                          {analysisResult.topWeaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2 bg-[#1E293B] rounded-lg p-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span className="text-sm text-gray-300">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                  </div>
                  </div>

                  {/* Due Diligence Questions */}
                <div className="dashboard-card rounded-xl p-4">
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Due Diligence Questions
                  </h3>
                  <div className="grid gap-2">
                        {analysisResult.diligenceQuestions.map((question, index) => (
                      <div key={index} className="flex items-start gap-2 bg-[#1E293B] rounded-lg p-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full flex-shrink-0">
                                {index + 1}
                              </span>
                        <span className="text-sm text-gray-300">{question}</span>
                          </div>
                        ))}
                      </div>
                </div>

                  {/* Red Flags */}
                  {analysisResult.redFlags && analysisResult.redFlags.length > 0 && (
                  <div className="dashboard-card rounded-xl p-4">
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                      <svg className="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                          Critical Risk Factors
                    </h3>
                    <ul className="space-y-2">
                          {analysisResult.redFlags.map((flag, index) => (
                        <li key={index} className="flex items-start gap-2 bg-[#1E293B] rounded-lg p-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span className="text-sm text-gray-300">{flag}</span>
                            </li>
                          ))}
                        </ul>
                  </div>
                )}

                {/* Founder Insights */}
                {analysisResult.founderInsights && analysisResult.founderInsights.length > 0 && (
                  <div className="dashboard-card rounded-xl p-4">
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                      <svg className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Founder Analysis
                    </h3>
                    <div className="space-y-3">
                      {analysisResult.founderInsights.map((founder, idx) => (
                        <div key={idx} className={`bg-[#1E293B] rounded-lg p-3 border ${
                          founder.totalScore >= 70 ? 'border-green-500/30' :
                          founder.totalScore >= 50 ? 'border-blue-500/30' :
                          founder.totalScore >= 30 ? 'border-yellow-500/30' :
                          'border-red-500/30'
                        }`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-200">{founder.name}</h4>
                              <p className="text-xs text-gray-400">{founder.role}</p>
                </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold mb-1 ${
                                founder.totalScore >= 70 ? 'text-green-400' :
                                founder.totalScore >= 50 ? 'text-blue-400' :
                                founder.totalScore >= 30 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>{founder.totalScore}</div>
                              <div className={`text-xs px-2 py-0.5 rounded-full ${
                                founder.totalScore >= 70 ? 'bg-green-500/20 text-green-400' :
                                founder.totalScore >= 50 ? 'bg-blue-500/20 text-blue-400' :
                                founder.totalScore >= 30 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>{founder.band}</div>
                      </div>
                    </div>

                          {/* Sub-scores */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {Object.entries(founder.scores).map(([dimension, score]) => (
                              <div key={dimension} className="bg-[#0F172A] rounded p-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-400 capitalize">
                                    {dimension.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <span className="text-xs font-medium text-gray-300">{score}/10</span>
                  </div>
                                <div className="w-full bg-gray-700/30 rounded-full h-1">
                                  <div 
                                    className={`h-1 rounded-full ${
                                      score >= 8 ? 'bg-green-400' :
                                      score >= 6 ? 'bg-blue-400' :
                                      score >= 4 ? 'bg-yellow-400' :
                                      'bg-red-400'
                                    }`}
                                    style={{ width: `${(score / 10) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Signals & Questions */}
                          <div className="space-y-2 text-xs">
                            {founder.strengthSignals?.length > 0 && (
                              <div>
                                <span className="text-green-400 font-medium">Strengths:</span>
                                <ul className="mt-1 space-y-1">
                                  {founder.strengthSignals.map((signal, i) => (
                                    <li key={i} className="flex gap-2 text-gray-300">
                                      <span className="text-green-400">•</span>
                                      {signal}
                                    </li>
                                  ))}
                                </ul>
                </div>
              )}
                            {founder.watchouts?.length > 0 && (
                              <div>
                                <span className="text-yellow-400 font-medium">Watch-outs:</span>
                                <ul className="mt-1 space-y-1">
                                  {founder.watchouts.map((watchout, i) => (
                                    <li key={i} className="flex gap-2 text-gray-300">
                                      <span className="text-yellow-400">•</span>
                                      {watchout}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {founder.followUpQs?.length > 0 && (
                              <div>
                                <span className="text-blue-400 font-medium">Follow-up Questions:</span>
                                <ul className="mt-1 space-y-1">
                                  {founder.followUpQs.map((q, i) => (
                                    <li key={i} className="flex gap-2 text-gray-300">
                                      <span className="text-blue-400">{i + 1}.</span>
                                      {q}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="dashboard-card rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 mb-6">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Fill out the company details and upload a pitch deck to get started with the analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default GPCopilot
