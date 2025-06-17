"use client"

import { useState } from "react"
import { Input } from "../Common/input"
import { Navbar } from "./navbar"
import { Footer } from "../Common/Footer"
import { Textarea } from "../../ui/textarea.jsx"
// import html2canvas from 'html2canvas'

export const GPCopilot = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [analysisSteps] = useState([
    { title: "Uploading pitch deck", description: "Processing PDF document...", duration: 3000 },
    { title: "Fetching founder profiles", description: "Analyzing founder data...", duration: 8000 },
    { title: "Extracting key metrics", description: "Parsing financial and traction data...", duration: 6000 },
    { title: "Running AI analysis", description: "Evaluating investment factors...", duration: 15000 },
    { title: "Generating insights", description: "Creating recommendations and scoring...", duration: 8000 }
  ])
  const [openaiKey] = useState(process.env.REACT_APP_OPENAI_API_KEY || '')
  const [LINKEDIN_API_KEY] = useState(process.env.LINKEDIN_API_KEY || '')
  // const [isExporting, setIsExporting] = useState(false)
  // const analysisRef = useRef(null)
  
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

  // Add new state for chat functionality
  const [conversationHistory, setConversationHistory] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)

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

  const startStepProgression = () => {
    setAnalysisStep(0)
    let currentStep = 0
    
    const progressToNextStep = () => {
      if (currentStep < analysisSteps.length - 1) {
        currentStep++
        setAnalysisStep(currentStep)
        setTimeout(progressToNextStep, analysisSteps[currentStep].duration)
      }
    }
    
    // Start the first step
    setTimeout(progressToNextStep, analysisSteps[0].duration)
  }

  const transformResponse = (rawResponse) => {
    // If already in correct format, return as-is
    if (rawResponse.quickScore && (rawResponse.whatTheyDo || rawResponse.summary)) {
      return rawResponse
    }

    // Transform from the alternative format the AI returned
    const factorMapping = {
      'founderMarketFit': 'Founder–Market Fit',
      'goToMarketWedge': 'Go-To-Market / Wedge',
      'marketTimingTailwinds': 'Market Timing / Tailwinds',
      'moatDefensibility': 'Moat & Defensibility',
      'capitalEfficiencyTraction': 'Capital Efficiency & Traction',
      'strategicFitWithFund': 'Strategic Fit with Fund'
    }

    const weightMapping = {
      'Founder–Market Fit': 2.0,
      'Go-To-Market / Wedge': 1.5,
      'Market Timing / Tailwinds': 1.2,
      'Moat & Defensibility': 1.2,
      'Capital Efficiency & Traction': 1.0,
      'Strategic Fit with Fund': 0.8
    }

    const factors = []
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
                (total >= 60 ? "Strong YES" : 
                 total >= 50 ? "Conditional SAFE" : "Pass for now")

    // Extract other fields if they exist
    if (rawResponse.topStrengths) topStrengths = rawResponse.topStrengths
    if (rawResponse.strengths) topStrengths = rawResponse.strengths  // Fallback
    if (rawResponse.topWeaknesses) topWeaknesses = rawResponse.topWeaknesses  
    if (rawResponse.weaknesses) topWeaknesses = rawResponse.weaknesses  // Fallback
    if (rawResponse.diligenceQuestions) diligenceQuestions = rawResponse.diligenceQuestions
    if (rawResponse.questions) diligenceQuestions = rawResponse.questions  // Fallback
    if (rawResponse.redFlags) redFlags = rawResponse.redFlags
    if (rawResponse.risks) redFlags = rawResponse.risks  // Fallback

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
          domainExpertise: 0,
          trackRecord: 0,
          executionDiscipline: 0,
          leadership: 0,
          networkLeverage: 0
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
      whatTheyDo: "<Not provided>",
      whyNow: "<Not provided>",
      theBet: "<Not provided>",
      competitiveAnalysis: {
        knownCompetitors: [],
        differentiation: "N/A",
        barriersToEntry: "N/A"
      },
      failureMode: "N/A",
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
    if (!formData.pitchDeckFileId) {
      alert('Please upload a pitch deck PDF before analyzing')
      return
    }

    setIsAnalyzing(true)
    setAnalysisStep(0)
    setAnalysisResult(null)
    setConversationHistory([]) // Clear chat history for new analysis
    startStepProgression()

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
    
    console.log('Processing founder LinkedIn URLs:')
    console.log('Founder 1:', formData.founderLinkedIn1)
    console.log('Founder 2:', formData.founderLinkedIn2)
    
    if (formData.founderLinkedIn1) {
      const id1 = extractLinkId(formData.founderLinkedIn1)
      console.log('Extracted ID1:', id1)
      const profile1 = await fetchLinkedInProfile(id1)
      console.log('Profile1 result:', profile1 ? 'Success' : 'Failed')
      if (profile1) {
        founderProfiles.push(profile1)
        founderMetrics.push(extractFounderMetrics(profile1))
      }
    }
    if (formData.founderLinkedIn2) {
      const id2 = extractLinkId(formData.founderLinkedIn2)
      console.log('Extracted ID2:', id2)
      const profile2 = await fetchLinkedInProfile(id2)
      console.log('Profile2 result:', profile2 ? 'Success' : 'Failed')
      if (profile2) {
        founderProfiles.push(profile2)
        founderMetrics.push(extractFounderMetrics(profile2))
      }
    }
    
    console.log('Total founder profiles fetched:', founderProfiles.length)
    console.log('Total founder metrics extracted:', founderMetrics.length)

    const systemPrompt = `##########  SYSTEM  ##########
You are "GP Copilot", a venture-capital analyst bot embedded in a web app.
Your job is to help General Partners and investment-team members
  • PRE-SCREEN deals before they talk to founders  
  • Surface *reasons to say NO* quickly  
  • Recommend the *most incisive questions* to ask if a call is scheduled  
  • Output a structured "Quick-Score Model" (0–100) based on the factors below.  

ANALYSIS MINDSET: Answer like you're trying to convince a skeptical IC partner in under 30 seconds.  

Your job is to generate a clear, concise scoring summary to help a Partner decide whether to pass, take a meeting, or move to IC.

DO NOT be polite. DO NOT hedge. Score the company like a Partner would — with clarity, skepticism, and conviction.

BATTLE-TESTED SCORING SYSTEM: 6 Categories Only
Use ONLY these 6 categories (no dilution, no academic completeness):

┌─────────────────────────────────────────────┬──────┐
│ Founder–Market Fit                       │  2.0 │
│ Go-To-Market / Wedge                     │  1.5 │  
│ Market Timing / Tailwinds                │  1.2 │
│ Moat & Defensibility                     │  1.2 │
│ Capital Efficiency & Traction            │  1.0 │
│ Strategic Fit with Fund                  │  0.8 │
└─────────────────────────────────────────────┴──────┘

CRITICAL REQUIREMENTS:
For each factor, provide:
• Raw score (0-10) based on peer-stage company comparison
• 1-sentence rationale referencing specifics from pitch deck/data
• Benchmark language: "better than avg seed SaaS founder", "top 25% of pre-seed fintech deals"

SCORING ANCHORS:
• 10 = Best-in-class (top 5% of deals you've seen)  
• 8-9 = Strong/Above average (top 25%)
• 6-7 = Average/Decent (median for stage/sector)
• 4-5 = Below average/Concerning  
• 1-3 = Weak/Red flag

DECISION LINKAGE:
≥ 60 → "Strong YES" (Send to Partner + prep intro)
50-59 → "Conditional SAFE" (Take meeting if milestone hit / risk removed)
< 50 → "Pass for now" (Archive, unless relationship path or FOMO trigger)

Your scores must support the verdict. Reference score bands in final decision rationale.

SCORING FACTORS (BATTLE-TESTED, 6 CATEGORIES ONLY):
  ┌──────────────────────────────────────────────┬──────┐
  │ Founder–Market Fit                        │  2.0 │
  │ Go-To-Market / Wedge                      │  1.5 │
  │ Market Timing / Tailwinds                 │  1.2 │
  │ Moat & Defensibility                      │  1.2 │
  │ Capital Efficiency & Traction             │  1.0 │
  │ Strategic Fit with Fund                   │  0.8 │
  └──────────────────────────────────────────────┴──────┘

HARSH EVALUATION RULES:
• Score 0-10 where 5 = typical startup at this stage
• Score 7+ only if you'd bet your LP's money on it 
• Score 9+ is reserved for best-in-class (top 5%)
• NO GRADE INFLATION - Partners will ask you to defend every point

REQUIRED: Each score needs 1-sentence justification referencing specifics.
Use benchmark language: "Better than avg seed SaaS founder" or "Worse than typical B2B wedge"

DECISION BANDS:
≥ 60 → "Strong YES" (Send to Partner + prep intro)
50-59 → "Conditional SAFE" (Take meeting if milestone hit)
< 50 → "Pass for now" (Archive unless FOMO trigger)

CRITICAL: Include these required fields:
• "benchmarkContext": Describe how this scores vs peer companies (e.g. "Top 25% of pre-seed fintech deals this quarter")
• "partnerSlackSummary": 2-sentence Partner-ready summary that references the scores and band for quick sharing

---

You will receive:
1. A pitch deck PDF to analyze
2. Company profile data
3. GP investment thesis
4. Founder LinkedIn profiles and metrics (may include 1-2 founders)

IMPORTANT: If multiple founders are provided, analyze ALL of them in the founderInsights array. Each founder should get their own complete analysis object.

IMPORTANT: Craft the GP Brief like you are pitching a skeptical IC partner.  
1. **What They Do** — Describe the company's product and model in plain English. Be mechanically specific:
   - Who uses the product
   - What they're actually doing or transacting
   - How value is delivered and monetized
   - Avoid vague categories like "marketplace" or "platform" unless clarified

2. **Why Now** — Explain the market or regulatory shifts that make this company possible or urgent today. Include:
   - Concrete catalysts (e.g. legislation, macro volatility, VC pullback, crypto infrastructure maturity)
   - Structural change (e.g. user behavior, LP churn, tools like SPVs becoming mainstream)
   - Avoid clichés like "growing interest" or "increasing demand"

3. **The Bet** — Frame the *venture bet* like you're pitching it to an IC:
   - What needs to go right for this to be a breakout
   - What wedge or early strategy could unlock distribution/power
   - What dominant position this company could occupy if it works
   - Make it startup-centric, not a macro narrative
Write with the mindset of: "I need to convince a skeptical Partner to take this call or pass in under 60 seconds." 
• Prioritize RISKS over optimism; call hype where you see it.  
• If info is missing, say so explicitly ("Missing revenue data").  
Here's a good example:

What They Do
LimitLess is a two-sided platform that gives accredited individuals direct access to top-tier VC funds through curated allocation opportunities, while enabling GPs to attract value-add LPs who bring domain expertise, networks, and startup referrals.

Why Now
Regulatory tailwinds, growing fatigue among traditional LPs, and rising retail interest in alternative assets are reshaping the fundraising landscape. With over 25 million accredited individuals in the U.S. locked out of VC returns, LimitLess is capitalizing on a generational shift in capital formation and LP composition.

The Bet
If LimitLess can consistently source high-quality LPs who deliver strategic value (e.g. domain expertise, hiring, intros), they become the default LP sourcing layer for mid-cap and emerging VC funds — replacing capital-only LPs with a network-driven, engaged investor base.

REQUIRED OUTPUT FORMAT (COPY EXACTLY):
{
  "whatTheyDo": "<A clear, specific business description in 10-15 words. Must include the customer, the product, and the core action. Avoid vague terms like 'platform' or 'solution'.>",
  "whyNow": "<less than 2 sentences, explaining why this startup is uniquely viable at this moment in time. Reference a specific trend, regulatory shift, or pain point. Avoid clichés like 'growing interest in X'.>",
  "theBet": "<A sharp, startup-specific investment thesis>",
  "competitiveAnalysis": {
    "knownCompetitors": [
      {
        "name": "<Competitor name>",
        "website": "<Company website URL>", 
        "description": "<Brief 1-sentence description of what they do>"
      }
    ],
    "differentiation": "<Why this startup is different>",
    "barriersToEntry": "<Structural obstacles rivals face>"
  },
  "failureMode": "<Likeliest way this startup fails>",
  "quickScore": {
    "factors": [
      {"name":"Founder–Market Fit","weight":2.0,"raw":0,"weighted":0.0,"rationale":"1-sentence justification with specifics from pitch deck"},
      {"name":"Go-To-Market / Wedge","weight":1.5,"raw":0,"weighted":0.0,"rationale":"1-sentence justification with specifics from pitch deck"},
      {"name":"Market Timing / Tailwinds","weight":1.2,"raw":0,"weighted":0.0,"rationale":"1-sentence justification with specifics from pitch deck"},
      {"name":"Moat & Defensibility","weight":1.2,"raw":0,"weighted":0.0,"rationale":"1-sentence justification with specifics from pitch deck"},
      {"name":"Capital Efficiency & Traction","weight":1.0,"raw":0,"weighted":0.0,"rationale":"1-sentence justification with specifics from pitch deck"},
      {"name":"Strategic Fit with Fund","weight":0.8,"raw":0,"weighted":0.0,"rationale":"1-sentence justification with specifics from pitch deck"}
    ],
    "total": 0.0,
    "band": "Strong YES / Conditional SAFE / Pass for now",
    "benchmarkContext": "Top X% of [stage] [sector] deals this quarter/year",
    "partnerSlackSummary": "2-sentence Partner-ready summary referencing scores and band"
  },
  "topStrengths": ["<max 5 bullet-style strings>"],
  "topWeaknesses": ["<max 5 bullet-style strings>"],
  "diligenceQuestions": ["<10 sharp questions the GP should ask the founders>"],
  "redFlags": ["<potential deal-breakers or serious risks>"],
  "founderInsights": [
    {
      "name": "<Founder full name>",
      "role": "<Title/Role>",
      "totalScore": 0,
      "band": "Strong / Neutral / Weak",
      "scores": {
        "domainExpertise": 0,
        "trackRecord": 0,
        "executionDiscipline": 0,
        "leadership": 0,
        "networkLeverage": 0
      },
      "strengthSignals": ["<specific examples of strength>"],
      "watchouts": ["<specific concerns or risks>"],
      "followUpQs": ["<specific questions to ask this founder>"],
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

FOUNDER ANALYSIS REQUIREMENTS:
- Score each founder 0-100 based on their fit for this specific startup
- Analyze using LinkedIn data and extracted metrics provided
- Focus on domain expertise, track record, execution capability
- Include specific examples in strengthSignals and watchouts
- Provide targeted follow-up questions for each founder
- Band: "Strong" (70+), "Neutral" (40-69), "Weak" (<40)

CRITICAL RULES:
1. Return ONLY valid JSON matching the above structure EXACTLY
2. Each "raw" score: integer 0-10
3. Each "weighted" score: raw × weight, rounded to 1 decimal
4. "total": sum of all weighted scores, rounded to 1 decimal  
5. "band": "Strong YES" OR "Conditional SAFE" OR "Pass for now"
6. All arrays limited to stated maximums
7. NO markdown, NO comments, NO explanations outside the JSON
8. IMPORTANT: Include ALL founders provided in founderInsights array - if 2 founders provided, return 2 founder objects
9. COMPETITORS: For knownCompetitors, provide 3-5 direct competitors with real company names, actual website URLs (https://...), and accurate 1-sentence descriptions
10. FOUNDER INSIGHTS: Must include detailed analysis for each founder with LinkedIn data provided

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
      setAnalysisStep(0)
    }
  }

  // Add followup question functionality
  const sendFollowupQuestion = async (question) => {
    if (!question.trim() || !analysisResult) return

    setIsChatLoading(true)
    
    try {
      // Build conversation history with initial analysis context
      const messages = [
        {
          role: 'system',
          content: `You are GP Copilot, a senior venture capital analyst. You previously analyzed a startup and provided this comprehensive analysis: ${JSON.stringify(analysisResult)}

You are a senior partner at a $500M venture fund. You've already reviewed this deal. Now you're answering follow-up questions from junior partners and LPs.
Push back. Challenge the logic. Prioritize *risks* over optimism.
If something is missing, say so. If something looks like hype, call it out.
Be intellectually honest and contrarian when necessary.
Make it bite—short, sharp, and actionable (≤250 words).`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: question
        }
      ]

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`)
      }

      const assistantResponse = data.choices[0].message.content

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: assistantResponse }
      ])

      setChatInput('')
    } catch (error) {
      console.error('Chat error:', error)
      alert(`Chat failed: ${error.message}`)
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendFollowupQuestion(chatInput)
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
    <div className="min-h-screen bg-white">
      <style>
        {`
        .dashboard-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .dashboard-input {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.2);
          color: #1a1a1a;
          transition: all 0.3s ease;
        }
        
        .dashboard-input:focus {
          border-color: rgba(0, 0, 0, 0.3);
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
        }
        
        .dashboard-highlight {
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .upload-area {
          background: #ffffff;
          border: 1px dashed rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .upload-area:hover {
          border-color: rgba(0, 0, 0, 0.4);
          background: #f9fafb;
        }
        
        .competitor-tooltip {
          max-width: 200px;
          word-wrap: break-word;
        }
        
        .competitor-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        `}
      </style>
      <Navbar currentPage="copilot" />
      
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-6">
        <div className="relative">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Input Forms */}
            <div className="col-span-5 space-y-3 relative">
              {/* Investment Thesis */}
              <div className="dashboard-card rounded-lg p-4">
                <h2 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-900">
                  <svg className="h-3 w-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Investment Thesis
                </h2>
                <Textarea
                  value={formData.gpInvestmentThesis}
                  onChange={(e) => handleInputChange('gpInvestmentThesis', e.target.value)}
                  placeholder="Describe your fund's investment thesis and strategic priorities..."
                  className="dashboard-input min-h-[60px] w-full rounded-md p-3 text-sm resize-none"
                />
              </div>

              {/* Company Profile - Pitch Deck Only */}
              <div className="dashboard-card rounded-lg p-4">
                <h2 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-900">
                  <svg className="h-3 w-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Pitch Deck
                </h2>
                <div className="upload-area rounded-md p-3">
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
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md">
                          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
            </div>
            <div>
                          <p className="text-sm font-medium text-gray-900">
                            {uploadStatus.isUploading ? 'Uploading...' : 'Upload Pitch Deck'}
                          </p>
                          <p className="text-xs text-gray-500">PDF format, max 32MB</p>
            </div>
          </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600 rounded-md">
                          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
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
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Replace file"
                          >
                            <svg className="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Remove file"
                          >
                            <svg className="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
            </button>
          </div>
        </div>
                    )}
                  </label>
                    </div>
                    </div>

              {/* Founder LinkedIn Profiles */}
              <div className="dashboard-card rounded-lg p-4">
                <h2 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-900">
                  <svg className="h-3 w-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Founders
                </h2>
                <div className="grid grid-cols-2 gap-2">
                      <Input
                    value={formData.founderLinkedIn1}
                    onChange={(e) => handleInputChange('founderLinkedIn1', e.target.value)}
                    placeholder="Founder 1 LinkedIn"
                    className="dashboard-input rounded-md p-2 text-sm"
                  />
                      <Input
                    value={formData.founderLinkedIn2}
                    onChange={(e) => handleInputChange('founderLinkedIn2', e.target.value)}
                    placeholder="Founder 2 LinkedIn"
                    className="dashboard-input rounded-md p-2 text-sm"
                      />
                    </div>
                  </div>

              {/* Notes & Comments */}
              <div className="dashboard-card rounded-lg p-4">
                <h2 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-900">
                  <svg className="h-3 w-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Notes & Comments
                </h2>
                <div className="space-y-2">
                    <Textarea
                      value={formData.interactionNotes}
                      onChange={(e) => handleInputChange('interactionNotes', e.target.value)}
                    placeholder="Meeting notes, founder conversations..."
                    className="dashboard-input min-h-[40px] w-full rounded-md p-2 text-sm resize-none"
                    />
                    <Textarea
                      value={formData.additionalDocs}
                      onChange={(e) => handleInputChange('additionalDocs', e.target.value)}
                    placeholder="Additional context, documents..."
                    className="dashboard-input min-h-[40px] w-full rounded-md p-2 text-sm resize-none"
                    />
                  </div>
              </div>
            </div>

            {/* Right Column - Analysis Results */}
            <div className="col-span-7">
              <div className="flex flex-col gap-4 ">
                {/* Fixed GP Copilot Card - Never changes size */}
                <div className="dashboard-card rounded-xl p-6 flex flex-col h-[660px]">
                  {isAnalyzing ? (
                    <div className="flex flex-col h-full px-6 py-4">
                      {/* Header with Icon and Current Step */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
                          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3">
                            <svg className="h-5 w-5 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{analysisSteps[analysisStep].title}</h3>
                          <p className="text-gray-500 text-sm">
                            {analysisSteps[analysisStep].description}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                          <span>Step {analysisStep + 1} of {analysisSteps.length}</span>
                          <span>{Math.round(((analysisStep + 1) / analysisSteps.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Compact Step List */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="space-y-2">
                          {analysisSteps.map((step, index) => (
                            <div key={index} className={`flex items-center gap-3 p-2 rounded-md transition-all duration-300 ${
                              index < analysisStep ? 'bg-green-50' :
                              index === analysisStep ? 'bg-blue-50' :
                              'bg-gray-50'
                            }`}>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                                index < analysisStep ? 'bg-green-500 text-white' :
                                index === analysisStep ? 'bg-blue-500 text-white animate-pulse' :
                                'bg-gray-300 text-gray-600'
                              }`}>
                                {index < analysisStep ? (
                                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  index + 1
                                )}
              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  index < analysisStep ? 'text-green-700' :
                                  index === analysisStep ? 'text-blue-700' :
                                  'text-gray-500'
                                }`}>
                                  {step.title}
                                </p>
                              </div>
                              {index === analysisStep && (
                                <div className="flex-shrink-0">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                              )}
                    </div>
                      ))}
                    </div>
                  </div>
                    </div>
                  ) : !analysisResult ? (
                    <>
                      {/* Header */}
                      <div className="mb-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                              GP Copilot
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600">
                                Beta
                      </span>
                            </h1>
                            <p className="text-xs text-gray-600">
                              Instant AI analysis for comprehensive startup evaluations to accelerate your deal flow and make informed investment decisions
                            </p>
                  </div>
                </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        <div className="text-center p-1.5 bg-gray-50 rounded">
                          <div className="text-sm font-semibold text-gray-900">0-100</div>
                          <div className="text-xs text-gray-600">Investment Score</div>
                        </div>
                        <div className="text-center p-1.5 bg-gray-50 rounded">
                          <div className="text-sm font-semibold text-gray-900">~30s</div>
                          <div className="text-xs text-gray-600">Analysis Time</div>
                        </div>
                  </div>

                      {/* Features */}
                      <div className="space-y-4 flex-1">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Analysis Report</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-xs">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-700">Investment recommendation with scoring rationale</span>
                                </div>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-700">Battle-tested 6-factor scoring system</span>
                              </div>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-gray-700">Tailored due diligence questions</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              <span className="text-gray-700">Risk factors and red flags</span>
                          </div>
                      </div>
                          </div>

                        <div className="pt-4 border-t border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <svg className="h-3 w-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Best Results
                          </h3>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 p-1.5 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="h-2 w-2 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <span className="text-xs text-gray-700">Comprehensive pitch decks with financials</span>
                            </div>
                            
                            <div className="flex items-center gap-2 p-1.5 bg-green-50 rounded-md hover:bg-green-100 transition-colors">
                              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="h-2 w-2 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <span className="text-xs text-gray-700">Founder LinkedIn profiles</span>
                            </div>
                            
                            <div className="flex items-center gap-2 p-1.5 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors">
                              <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="h-2 w-2 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                              <span className="text-xs text-gray-700">Meeting notes and context</span>
                            </div>
                          </div>
                        </div>

                        {/* Disclaimer Section */}
                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-start gap-2 text-xs text-gray-500">
                            <svg className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                                                        <p>
                              GP Copilot provides AI-powered insights to support investment decisions. While our analysis is comprehensive, it should be used as a supplementary tool alongside your expertise and due diligence.
                            </p>
                        </div>
                            </div>
                          </div>
                    </>
                  ) : (
                    <>
                       {/* Fixed Header for Results */}
                       <div className="mb-4 pb-4 border-b border-gray-100 flex-shrink-0">
                         <div className="flex items-start gap-3">
                           <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                             <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                             </svg>
              </div>
                           <div className="flex-1 min-w-0">
                             <h1 className="text-base font-semibold text-gray-900 mb-1">Analysis Complete</h1>
                             <p className="text-xs text-gray-600">
                               Investment recommendation and insights
                             </p>
                           </div>
                         </div>
                       </div>

                       {/* Scrollable Results Content - Takes remaining space */}
                       <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0">
                                           {/* GP Brief & Score */}
                         <div className="grid grid-cols-3 gap-4">
                           <div className="col-span-2 dashboard-card rounded-xl p-4">
                             <h3 className="text-base font-semibold mb-3 text-gray-900">GP Brief</h3>
                             <div className="space-y-3">
                               <div>
                                 <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">What They Do</span>
                                 <p className="text-sm font-medium text-gray-900 mt-1">{analysisResult?.whatTheyDo || 'N/A'}</p>
                    </div>
                               <div>
                                 <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Why Now</span>
                                 <p className="text-sm text-gray-700 mt-1">{analysisResult?.whyNow || 'N/A'}</p>
                    </div>
                               <div>
                                 <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">The Bet</span>
                                 <p className="text-sm text-gray-700 mt-1">{analysisResult?.theBet || 'N/A'}</p>
                  </div>
                  </div>
                </div>

                           <div className={`dashboard-card rounded-xl p-4 border-2 ${
                             (analysisResult?.quickScore?.total || 0) >= 60 ? 'border-green-500' :
                             (analysisResult?.quickScore?.total || 0) >= 50 ? 'border-blue-500' :
                             'border-red-500'
                           }`}>
                             <div className="text-center mb-4">
                               <div className="flex items-center justify-between mb-2">
                                 <div className="text-sm font-medium text-gray-600">Quick Score</div>
                        </div>
                               <div className={`text-4xl font-bold mb-2 ${
                                 (analysisResult?.quickScore?.total || 0) >= 60 ? 'text-green-600' :
                                 (analysisResult?.quickScore?.total || 0) >= 50 ? 'text-blue-600' :
                                 'text-red-600'
                               }`}>{analysisResult?.quickScore?.total || 0}</div>
                               <div className={`text-xs px-2 py-0.5 rounded-full ${
                                 (analysisResult?.quickScore?.total || 0) >= 60 ? 'bg-green-100 text-green-700' :
                                 (analysisResult?.quickScore?.total || 0) >= 50 ? 'bg-blue-100 text-blue-700' :
                                 'bg-red-100 text-red-700'
                               }`}>{analysisResult?.quickScore?.band || 'N/A'}</div>
                               {analysisResult?.quickScore?.benchmarkContext && (
                                 <div className="text-xs text-gray-500 mt-1 text-center">
                                   {analysisResult.quickScore.benchmarkContext}
                                 </div>
                               )}
              </div>
                             
                             {/* Competitors Section */}
                             {analysisResult?.competitiveAnalysis?.knownCompetitors && analysisResult.competitiveAnalysis.knownCompetitors.length > 0 && (
                               <div className="border-t border-gray-200 pt-3">
                                 <div className="text-xs font-medium text-gray-600 mb-2 text-center">Key Competitors</div>
                                                                  <div className="space-y-1">
                                   {analysisResult.competitiveAnalysis.knownCompetitors.slice(0, 3).map((competitor, index) => {
                                     // Handle both old string format and new object format
                                     const competitorName = typeof competitor === 'string' ? competitor : competitor.name
                                     const competitorWebsite = typeof competitor === 'string' 
                                       ? `https://www.google.com/search?q=${encodeURIComponent(competitor)}` 
                                       : competitor.website
                                     const competitorDescription = typeof competitor === 'string'
                                       ? `Search for ${competitor} online`
                                       : competitor.description
                                     
                                     return (
                                       <div
                                         key={index}
                                         className="relative group"
                                         title={competitorDescription}
                                       >
                                         <a
                                           href={competitorWebsite}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="competitor-link block px-2 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-all duration-200 cursor-pointer text-center"
                                         >
                                           <span className="text-xs font-medium text-gray-700 hover:text-gray-900">
                                             {competitorName}
                                           </span>
                                           <svg className="h-2.5 w-2.5 text-gray-400 inline ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                           </svg>
                                         </a>
                                         
                                         {/* Hover tooltip */}
                                         <div className="competitor-tooltip absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                           {competitorDescription}
                                           <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                    </div>
                    </div>
                                     )
                                   })}
                  </div>
                  </div>
                             )}
                </div>
                  </div>

                         {/* Partner Summary */}
                         {analysisResult?.quickScore?.partnerSlackSummary && (
                           <div className="dashboard-card rounded-xl p-4 bg-blue-50 border-blue-200">
                             <h3 className="text-base font-semibold mb-2 flex items-center gap-2 text-blue-900">
                               <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                               </svg>
                               Partner Summary
                             </h3>
                             <p className="text-sm text-blue-800 leading-relaxed">{analysisResult.quickScore.partnerSlackSummary}</p>
                        </div>
                         )}

                         {/* Competitive Landscape (moved up) */}
                         {analysisResult && (
                           <div className="dashboard-card rounded-xl p-4">
                             <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-900">
                               <svg className="h-4 w-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3z" />
                               </svg>
                               Competitive Landscape
                             </h3>
                             <div className="space-y-2 text-sm">
                               <div>
                                 <span className="font-medium text-gray-700">Known Competitors:</span>
                                 <span className="text-gray-700 ml-1">
                                   {analysisResult?.competitiveAnalysis?.knownCompetitors?.length > 0
                                     ? analysisResult.competitiveAnalysis.knownCompetitors
                                         .map(comp => typeof comp === 'string' ? comp : comp.name)
                                         .join(', ')
                                     : 'N/A'}
                                 </span>
                  </div>
                               <div>
                                 <span className="font-medium text-gray-700">Differentiation:</span>
                                 <span className="text-gray-700 ml-1">{analysisResult?.competitiveAnalysis?.differentiation || 'N/A'}</span>
                               </div>
                               <div>
                                 <span className="font-medium text-gray-700">Barriers to Entry:</span>
                                 <span className="text-gray-700 ml-1">{analysisResult?.competitiveAnalysis?.barriersToEntry || 'N/A'}</span>
                               </div>
                             </div>
                             <div className="mt-3 text-xs text-red-700 font-medium">
                               Likeliest Failure Mode: {analysisResult?.failureMode || 'N/A'}
                             </div>
                           </div>
                         )}

                         {/* Founder Analysis (moved up) */}
                         {analysisResult?.founderInsights && analysisResult.founderInsights.length > 0 && (
                           <div className="dashboard-card rounded-xl p-4">
                             <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-900">
                               <svg className="h-4 w-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                               </svg>
                               Founder Analysis
                             </h3>
                      <div className="space-y-3">
                               {(analysisResult.founderInsights || []).map((founder, idx) => (
                                 <div key={idx} className={`bg-gray-50 rounded-lg p-3 border ${
                                   founder.totalScore >= 70 ? 'border-green-500' :
                                   founder.totalScore >= 50 ? 'border-blue-500' :
                                   founder.totalScore >= 30 ? 'border-yellow-500' :
                                   'border-red-500'
                                 }`}>
                                   {/* existing founder card content copied from original block */}
                                   {/** Header **/}
                                   <div className="flex justify-between items-start mb-3">
                                     <div>
                                       <h4 className="text-sm font-medium text-gray-900">{founder.name}</h4>
                                       <p className="text-xs text-gray-600">{founder.role}</p>
                                     </div>
                              <div className="text-right">
                                       <div className={`text-lg font-bold mb-1 ${
                                         founder.totalScore >= 70 ? 'text-green-600' :
                                         founder.totalScore >= 50 ? 'text-blue-600' :
                                         founder.totalScore >= 30 ? 'text-yellow-600' :
                                         'text-red-600'
                                       }`}>{founder.totalScore}</div>
                                       <div className={`text-xs px-2 py-0.5 rounded-full ${
                                         founder.totalScore >= 70 ? 'bg-green-100 text-green-700' :
                                         founder.totalScore >= 50 ? 'bg-blue-100 text-blue-700' :
                                         founder.totalScore >= 30 ? 'bg-yellow-100 text-yellow-700' :
                                         'bg-red-100 text-red-700'
                                       }`}>{founder.band}</div>
                                </div>
                              </div>

                                   {/* Scores */}
                                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                                     {['domainExpertise','trackRecord','executionDiscipline','leadership','networkLeverage'].map((dimension) => {
                                       const score = founder.scores?.[dimension]
                                       if (score === undefined) return null
                                       return (
                                         <div key={dimension} className="bg-white rounded p-2 border border-gray-200">
                                           <div className="flex justify-between items-center mb-1">
                                             <span className="text-xs text-gray-600 capitalize break-words">
                                               {dimension.replace(/([A-Z])/g, ' $1').trim()}
                                             </span>
                                             <span className="text-xs font-medium text-gray-900">{score}/10</span>
                            </div>
                                           <div className="w-full bg-gray-200 rounded-full h-1">
                                             <div className={`h-1 rounded-full ${
                                               score >= 8 ? 'bg-green-500' :
                                               score >= 6 ? 'bg-blue-500' :
                                               score >= 4 ? 'bg-yellow-500' :
                                               'bg-red-500'
                                             }`} style={{ width: `${(score / 10) * 100}%` }} />
                          </div>
                      </div>
                                       )
                                     })}
                          </div>

                                   {/* Strengths, Watchouts, Questions same as original */}
                                   <div className="space-y-2 text-xs">
                                     {founder.strengthSignals?.length > 0 && (
                                       <div>
                                         <span className="text-green-600 font-medium">Strengths:</span>
                                         <ul className="mt-1 space-y-1">
                                           {(founder.strengthSignals || []).map((signal, i) => (
                                             <li key={i} className="flex items-start gap-2 text-gray-700">
                                               <span className="text-green-600 mt-0.5 flex-shrink-0">•</span>
                                               <span>{signal}</span>
                            </li>
                          ))}
                        </ul>
                                       </div>
                                     )}

                                     {founder.watchouts?.length > 0 && (
                                       <div>
                                         <span className="text-yellow-600 font-medium">Watch-outs:</span>
                                         <ul className="mt-1 space-y-1">
                                           {(founder.watchouts || []).map((watchout, i) => (
                                             <li key={i} className="flex items-start gap-2 text-gray-700">
                                               <span className="text-yellow-600 mt-0.5 flex-shrink-0">•</span>
                                               <span>{watchout}</span>
                                             </li>
                                           ))}
                                         </ul>
                          </div>
                                     )}

                                     {founder.followUpQs?.length > 0 && (
                                       <div>
                                         <span className="text-blue-600 font-medium">Follow-up Questions:</span>
                                         <ul className="mt-1 space-y-1">
                                           {(founder.followUpQs || []).map((q, i) => (
                                             <li key={i} className="flex items-start gap-2 text-gray-700">
                                               <span className="text-blue-600 mt-0.5 flex-shrink-0">{i + 1}.</span>
                                               <span>{q}</span>
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

                         {/* Scoring Breakdown */}
                         <div className="dashboard-card rounded-xl p-4">
                           <div className="flex items-center justify-between mb-3">
                             <h3 className="text-base font-semibold text-gray-900">Scoring Breakdown</h3>
                             <div className="text-xs text-gray-500">
                               Click for details
                        </div>
                           </div>
                           <div className="space-y-3">
                             {(analysisResult.quickScore?.factors || []).map((factor, index) => {
                               // Calculate score color
                               const scoreColor = 
                                 factor.raw >= 8 ? 'bg-green-500' :
                                 factor.raw >= 6 ? 'bg-blue-500' :
                                 factor.raw >= 4 ? 'bg-yellow-500' :
                                 'bg-red-500';
                               
                               return (
                                 <div 
                                   key={index} 
                                   className="bg-gray-50 rounded-lg p-3"
                                 >
                            <div className="flex items-start gap-3">
                                     {/* Score circle */}
                                     <div className="relative flex-shrink-0">
                                       <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                         <span className="text-sm font-bold text-gray-700">{factor.raw}</span>
                    </div>
                                       <div 
                                         className={`absolute inset-0 rounded-full ${scoreColor} opacity-20`}
                                       ></div>
                    </div>
                                     
                                     {/* Factor details */}
                                     <div className="min-w-0 flex-1">
                                       <div className="flex items-center justify-between mb-1">
                                         <h4 className="text-sm font-medium text-gray-900">
                                           {factor.name}
                                         </h4>
                                         <span className="text-xs text-gray-500 font-medium">
                                           Score: {factor.weighted}
                              </span>
                            </div>
                                       <p className="text-xs text-gray-600 leading-relaxed">
                                         {factor.rationale || 'No rationale provided'}
                                       </p>
                  </div>
                </div>
                        </div>
                               );
                             })}
                           </div>
                  </div>

                         {/* Due Diligence Questions */}
                         <div className="dashboard-card rounded-xl p-4">
                           <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-900">
                             <svg className="h-4 w-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                             </svg>
                             Due Diligence Questions
                           </h3>
                           <div className="grid gap-2">
                        {(analysisResult.diligenceQuestions || []).map((question, index) => (
                               <div key={index} className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                                 <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex-shrink-0">
                                {index + 1}
                              </span>
                                 <span className="text-sm text-gray-700">{question}</span>
                          </div>
                        ))}
                      </div>
                         </div>

                  {/* Red Flags */}
                         {analysisResult?.redFlags && analysisResult.redFlags.length > 0 && (
                           <div className="dashboard-card rounded-xl p-4">
                             <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-900">
                               <svg className="h-4 w-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                               </svg>
                          Critical Risk Factors
                             </h3>
                             <ul className="space-y-2">
                          {(analysisResult.redFlags || []).map((flag, index) => (
                                 <li key={index} className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                                   <span className="text-red-600 mt-0.5 flex-shrink-0">•</span>
                                   <span className="text-sm text-gray-700">{flag}</span>
                            </li>
                          ))}
                        </ul>
                           </div>
                         )}

                         {/* Chat Interface */}
                         <div className="mt-6 border-t border-gray-200 pt-4 min-h-[300px]">
                           <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                             <svg className="h-4 w-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                             </svg>
                             Ask Follow-up Questions
                           </h3>
                           
                           {/* Chat History */}
                                                                                   {conversationHistory.length > 0 ? (
                              <div className="mb-4 space-y-3 max-h-[384px] overflow-y-auto bg-gray-50 rounded-lg p-4">
                                {(conversationHistory || []).map((message, index) => (
                                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-2.5 rounded-lg text-xs ${
                                      message.role === 'user' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white text-gray-800 border border-gray-200'
                                    }`}>
                                      {message.content}
                                    </div>
                                  </div>
                                ))}
                </div>
              ) : (
                             <div className="mb-6 p-6 bg-gray-50 rounded-lg text-center">
                               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                 <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>
                      </div>
                               <p className="text-gray-600 text-sm mb-2">Ready to dive deeper into this analysis?</p>
                               <p className="text-gray-500 text-xs">Ask questions about risks, comparisons, or next steps</p>
                    </div>
                           )}

                           {/* Chat Input */}
                           <div className="flex gap-2">
                             <input
                               type="text"
                               value={chatInput}
                               onChange={(e) => setChatInput(e.target.value)}
                               onKeyPress={handleKeyPress}
                               placeholder="Ask questions about this analysis..."
                               className="flex-1 dashboard-input rounded-md p-2 text-sm"
                               disabled={isChatLoading}
                             />
                             <button
                               onClick={() => sendFollowupQuestion(chatInput)}
                               disabled={isChatLoading || !chatInput.trim()}
                               className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                               {isChatLoading ? (
                                 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                 </svg>
                               ) : (
                                 <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                 </svg>
                               )}
                             </button>
                  </div>

                           {/* Quick Questions */}
                           <div className="mt-3">
                             <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                             <div className="flex flex-wrap gap-2">
                               {[
                                 "What are the biggest risks?",
                                 "How does this compare to similar deals?",
                                 "What would make this a stronger investment?",
                                 "What additional due diligence is needed?"
                               ].map((question, index) => (
                                 <button
                                   key={index}
                                   onClick={() => setChatInput(question)}
                                   className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                                 >
                                   {question}
                                 </button>
                               ))}
                </div>
                           </div>
                         </div>
                       </div>
                     </>
              )}
                 </div>
                
                {/* Run Analysis Button */}
                <button
                  onClick={analyzeCompany}
                  disabled={isAnalyzing || !openaiKey?.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg py-2.5 px-4 font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-sm">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">Run Analysis</span>
                    </>
                  )}
                </button>
                </div>
                      </div>
                    </div>
                  </div>
      </div>

      <Footer />
    </div>
  )
}

export default GPCopilot

