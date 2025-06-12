"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { PieChart, X, Building, User, ExternalLink, Calendar, MessageSquare, Send } from "lucide-react"
import { Footer } from "../Common/Footer"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "../../ui/badge.tsx"
import { Button } from "../../ui/button.tsx"

export const LPPortfolio = () => {
  const userId = localStorage.getItem("userId")
  const [portfolioStats, setPortfolioStats] = useState({
    totalInvested: "0",
    totalValue: "0",
    totalReturn: "N/A",
    activeInvestments: "0"
  })
  const [investments, setInvestments] = useState([])
  const [investmentsLoading, setInvestmentsLoading] = useState(true)
  const [expandedRowLoading, setExpandedRowLoading] = useState(false)
  const [isReferralOpen, setIsReferralOpen] = useState(false)
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false)
  const [currentFundId, setCurrentFundId] = useState("")
  const [currentFundAnnouncements, setCurrentFundAnnouncements] = useState([])
  const [pastReferrals, setPastReferrals] = useState([])
  const [referralsLoading, setReferralsLoading] = useState(false)
  const [dealFlow, setDealFlow] = useState({
    lp_uuid: localStorage.getItem("userId") || "",
    gp_uuid: "",
    company_name: "",
    founders: [
      { name: "", linkedin: "", email: "" }
    ],
    website: "",
    lp_relationship: "",
    linkedin: "",
    description: ""
  });

  const navigate = useNavigate();

  const getPortfolioCompanies = async (fundId) => {
    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/get-fund-portcos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: fundId }),
      });
      const data = await response.json();
      if (data) {
        return data.portCos || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching portfolio companies:', error);
      return [];
    }
  };

  const fetchInvestments = async () => {
      try {
        setInvestmentsLoading(true)
        const res = await fetch(
          `https://limitless-backend.vercel.app/api/get-funds-invested`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: userId })
          }
        );

        const data = await res.json();
        let totalInvested = 0;
        if (data) {
          const mappedInvestments = data.funds.map((investment) => {
              const fund = investment.Fund;
              const investmentDetails = investment.Investment;

              totalInvested = totalInvested + investmentDetails.commitment_amount;
              
              return {
                  fundId: investmentDetails.fund_id,
                  gpUUID: fund.gpUUID,
                  fundName: fund.fundName,
                  categories: fund.categories,
                  investedAmount: `$${investmentDetails.commitment_amount.toLocaleString()}`,
                  minInvestment: `$${fund.financials.minInvestment.toLocaleString()}`,
                  fundSize: `$${fund.financials.fundSize.toLocaleString()}`,
                  managementFee: `${fund.financials.managementFee}%`,
                  capitalCall: fund.timelines.capitalCallSchedule?.[0]
                  ? new Date(fund.timelines.capitalCallSchedule[0]).toDateString()
                  : "N/A",
                  announcements: [],
                  announcementIds: fund.announcements || [],
                  expanded: false,
                  portfolioCompanies: []
              };
        });
        setInvestments(mappedInvestments);
        setPortfolioStats({
          totalInvested: `$${totalInvested.toLocaleString()}`,
          totalValue: `$${totalInvested.toLocaleString()}`,
          totalReturn: "N/A",
          activeInvestments: mappedInvestments.length.toString()
        });
        setInvestmentsLoading(false);
      } else {
        console.error("Failed to fetch investments:", data.message);
    }} catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchAnnouncements = async (announcementIds) => {
    try {
      const res = await fetch(
        `https://limitless-backend.vercel.app/api/get-announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ announcement_ids: announcementIds })
        }
      );

      const data = await res.json();
      return data.announcements || [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  }

  useEffect(() => {
    fetchInvestments()
  }, [])

  const handleRowExpand = async (index) => {
    const investment = investments[index];
    if (!investment.expanded) {
      setExpandedRowLoading(true);
      setCurrentFundId(investment.gpUUID);
      
      try {
        const [announcements, portCos] = await Promise.all([
          fetchAnnouncements(investment.announcementIds),
          getPortfolioCompanies(investment.fundId)
        ]);

        const updatedInvestments = investments.map((inv, i) =>
          i === index ? { ...inv, announcements, portfolioCompanies: portCos, expanded: true } : inv
        );
        setInvestments(updatedInvestments);
      } catch (error) {
        console.error("Error expanding row:", error);
      } finally {
        setExpandedRowLoading(false);
      }
    } else {
      const updatedInvestments = investments.map((inv, i) =>
        i === index ? { ...inv, expanded: false } : inv
      );
      setInvestments(updatedInvestments);
      setCurrentFundId("");
    }
  };

   // Deal Submission Logic
   const handleDealSubmission = async (dealData, fundId) => {
    try {
      const response = await fetch(
        "https://limitless-backend.vercel.app/api/provide-referral-deal-flow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...dealData, action: "create_new_deal_flow", gp_uuid: fundId}),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Deal submitted successfully:", result);
        alert("Deal submitted successfully!");
        navigate("/lp-portfolio"); // Redirect to the portfolio page after submission
      } else {
        console.error("Failed to submit deal:", response.statusText);
        // alert("Failed to submit deal. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting deal:", error);
      alert("An error occurred while submitting the deal.");
    }
  };

  const handleAddFounder = () => {
    setDealFlow({...dealFlow, founders: [...dealFlow.founders, { name: "", linkedin: "", email: "" }]});
  };
  
  const handleRemoveFounder = (index) => {
    setDealFlow({...dealFlow, founders: dealFlow.founders.filter((_, i) => i !== index)});
  };

  const fetchPastReferrals = async (gpUUID) => {
    try {
      setReferralsLoading(true);
      const response = await fetch(
        "https://limitless-backend.vercel.app/api/provide-referral-deal-flow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "get_existing_deal_flows",
            lp_uuid: userId,
            gp_uuid: gpUUID
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPastReferrals(data.referrals || []);
      } else {
        console.error("Failed to fetch past referrals");
        setPastReferrals([]);
      }
    } catch (error) {
      console.error("Error fetching past referrals:", error);
      setPastReferrals([]);
    } finally {
      setReferralsLoading(false);
    }
  };

  const openReferralPanel = (gpUUID) => {
    setCurrentFundId(gpUUID);
    setIsReferralOpen(true);
    fetchPastReferrals(gpUUID);
  };

  const closeReferralPanel = () => {
    setIsReferralOpen(false);
    setTimeout(() => {
      setCurrentFundId("");
      setPastReferrals([]);
      setDealFlow({
        lp_uuid: localStorage.getItem("userId") || "",
        gp_uuid: "",
        company_name: "",
        founders: [{ name: "", linkedin: "", email: "" }],
        website: "",
        lp_relationship: "",
        linkedin: "",
        description: ""
      });
    }, 300);
  };

  const openAnnouncementsModal = (announcements, gpUUID) => {
    setCurrentFundAnnouncements(announcements);
    setCurrentFundId(gpUUID);
    setIsAnnouncementsOpen(true);
  };

  const closeAnnouncementsModal = () => {
    setIsAnnouncementsOpen(false);
    setTimeout(() => {
      setCurrentFundAnnouncements([]);
      setCurrentFundId("");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav currentPage={"Portfolio"} />
      
      <main className="flex-grow pt-16">
        {/* Pitch Black Hero Section */}
        <div className="relative bg-black text-white">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl font-extralight mb-6 tracking-tight">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Your Portfolio
                  </span>
                  <br />
                  <span className="text-white">Dashboard</span>
                </h1>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
              >
                Monitor your investments, track performance, and explore portfolio companies with real-time insights
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="relative -mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {investmentsLoading ? (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div className="h-6 bg-gray-300 rounded animate-pulse w-32"></div>
                      </div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group"
                >
                                      <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Invested</p>
                        <h3 className="text-2xl font-semibold text-gray-900 mt-2">{portfolioStats.totalInvested}</h3>
                      </div>
                      <div className="bg-gray-50 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <PieChart className="h-8 w-8 text-gray-600" />
                      </div>
                    </div>
                </motion.div>
                                  <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group"
                >
                                      <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Value</p>
                        <h3 className="text-2xl font-semibold text-gray-900 mt-2">{portfolioStats.totalValue}</h3>
                      </div>
                      <div className="bg-gray-50 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <PieChart className="h-8 w-8 text-gray-600" />
                      </div>
                    </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group"
                >
                                      <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Return</p>
                        <h3 className="text-2xl font-semibold text-gray-900 mt-2">{portfolioStats.totalReturn}</h3>
                      </div>
                      <div className="bg-gray-50 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <PieChart className="h-8 w-8 text-gray-600" />
                      </div>
                    </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group"
                >
                                      <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Active Investments</p>
                        <h3 className="text-2xl font-semibold text-gray-900 mt-2">{portfolioStats.activeInvestments}</h3>
                      </div>
                      <div className="bg-gray-50 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <PieChart className="h-8 w-8 text-gray-600" />
                      </div>
                    </div>
                </motion.div>
              </>
            )}
            </div>
          </div>
        </div>

        {/* Enhanced Active Investments */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Active Investments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Monitor your investment portfolio with detailed fund information, announcements, and portfolio companies
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Exit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {investmentsLoading ? (
                    <>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    investments.map((investment, index) => (
                    <Fragment key={index}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="group hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                        onClick={() => handleRowExpand(index)}
                      >
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <motion.div
                            initial={{ rotate: investment.expanded ? 0 : -90 }}
                            animate={{ rotate: investment.expanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="inline-block transform"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </motion.div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{investment.fundName}</div>
                            <div className="text-sm text-gray-500">{investment.firm}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{investment.investedAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{investment.investedAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-600">{investment.return || "N/A"}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{investment.exitDate || "N/A"}</td>
                      </motion.tr>
                      {investment.expanded && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-8 py-8">
                            <div className="flex flex-wrap gap-6">
                              {/* Left Section: Fund Info */}
                              <div className="flex-1">
                                <h4 className="text-base font-semibold text-gray-700 mb-4">Fund Info</h4>
                                <div className="space-y-4">
                                  <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Categories</h4>
                                    <p className="text-gray-900 font-medium">{investment.categories.join(", ")}</p>
                                  </div>
                                  <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Minimum Investment</h4>
                                    <p className="text-gray-900 font-medium">{investment.minInvestment}</p>
                                  </div>
                                  <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Fund Size</h4>
                                    <p className="text-gray-900 font-medium">{investment.fundSize}</p>
                                  </div>
                                  <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Management Fee</h4>
                                    <p className="text-gray-900 font-medium">{investment.managementFee}</p>
                                  </div>
                                  <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Capital Call</h4>
                                    <p className="text-gray-900 font-medium">{investment.capitalCall}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Middle Section: Announcements */}
                              <div className="flex-1 flex flex-col">
                                <h4 className="text-base font-semibold text-gray-700 mb-4">Announcements</h4>
                                <div className="flex-1 flex flex-col">
                                  {expandedRowLoading ? (
                                    <div className="space-y-4">
                                      {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 animate-pulse">
                                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : investment.announcements.length > 0 ? (
                                    <div className="space-y-4">
                                      {investment.announcements.slice(0, 5).map((announcement, i) => (
                                        <div key={i} className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-6 border border-gray-100">
                                          <h5 className="text-sm font-semibold text-gray-700 mb-2">{announcement.title}</h5>
                                          <p className="text-gray-500 text-xs mb-3">{announcement.date}</p>
                                          <p className="text-gray-900 leading-relaxed">{announcement.description || announcement.message}</p>
                                        </div>
                                      ))}
                                      {investment.announcements.length > 5 && (
                                        <p className="text-sm text-gray-500 text-center">
                                          And {investment.announcements.length - 5} more announcements...
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-center py-8">
                                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                      <p className="text-gray-500">No announcements available</p>
                                      <p className="text-sm text-gray-400 mt-1">Updates will appear here when posted</p>
                                    </div>
                                  )}
                                </div>
                                
                                {!expandedRowLoading && investment.announcements.length > 0 && (
                                  <button
                                    onClick={() => openAnnouncementsModal(investment.announcements, investment.gpUUID)}
                                    className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:shadow-md"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    View All Announcements
                                  </button>
                                )}
                              </div>

                              {/* Right Section: Portfolio Companies */}
                              <div className="flex-1 flex flex-col">
                                <h4 className="text-base font-semibold text-gray-700 mb-4">Portfolio Companies</h4>
                                <div className="flex-1 flex flex-col">
                                  {expandedRowLoading ? (
                                    <div className="space-y-4">
                                      {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 animate-pulse">
                                          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                          <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                                          <div className="flex gap-3">
                                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      {investment?.portfolioCompanies?.length > 0 ? (
                                        investment.portfolioCompanies.map((company, i) => (
                                          <div key={i} className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-6 border border-gray-100">
                                            <h5 className="text-sm font-semibold text-gray-900 mb-2">{company.name}</h5>
                                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{company.description}</p>
                                            <div className="flex gap-3">
                                              {company.website && (
                                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium">
                                                  <ExternalLink className="h-3 w-3 mr-1" />
                                                  Website
                                                </a>
                                              )}
                                              {company.linkedin && (
                                                <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium">
                                                  <Building className="h-3 w-3 mr-1" />
                                                  LinkedIn
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="text-center py-8">
                                          <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                          <p className="text-gray-500">No portfolio companies available</p>
                                          <p className="text-sm text-gray-400 mt-1">Portfolio companies will appear here</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {!expandedRowLoading && (
                                  <button
                                    onClick={() => openReferralPanel(investment.gpUUID)}
                                    className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:shadow-md"
                                  >
                                    <Building className="h-4 w-4 mr-2" />
                                    Refer Company
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Company Referral Sliding Window */}
      <ReferralSlider 
        isOpen={isReferralOpen}
        onClose={closeReferralPanel}
        dealFlow={dealFlow}
        setDealFlow={setDealFlow}
        pastReferrals={pastReferrals}
        referralsLoading={referralsLoading}
        currentFundId={currentFundId}
        onAddFounder={handleAddFounder}
        onRemoveFounder={handleRemoveFounder}
        onSubmitDeal={handleDealSubmission}
      />

      {/* Announcements Modal */}
      <AnnouncementsModal 
        isOpen={isAnnouncementsOpen}
        onClose={closeAnnouncementsModal}
        announcements={currentFundAnnouncements}
        currentFundId={currentFundId}
      />

      <Footer />
    </div>
  )
}

function ReferralSlider({ 
  isOpen, 
  onClose, 
  dealFlow, 
  setDealFlow, 
  pastReferrals, 
  referralsLoading, 
  currentFundId, 
  onAddFounder, 
  onRemoveFounder, 
  onSubmitDeal 
}) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-gray-900 border-l shadow-xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full">
          {/* Left Side - Referral Form */}
          <div className="flex-1 flex flex-col border-r">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <Building className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Refer a Company</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  value={dealFlow.company_name}
                  onChange={(e) => setDealFlow({ ...dealFlow, company_name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter company name"
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Founders</h3>
                {dealFlow.founders.map((founder, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Founder {index + 1}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={founder.name}
                          onChange={(e) =>
                            setDealFlow((prev) => ({
                              ...prev,
                              founders: prev.founders.map((f, i) =>
                                i === index ? { ...f, name: e.target.value } : f
                              ),
                            }))
                          }
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                          placeholder="Founder name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={founder.linkedin}
                          onChange={(e) =>
                            setDealFlow((prev) => ({
                              ...prev,
                              founders: prev.founders.map((f, i) =>
                                i === index ? { ...f, linkedin: e.target.value } : f
                              ),
                            }))
                          }
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                          placeholder="LinkedIn profile URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={founder.email}
                          onChange={(e) =>
                            setDealFlow((prev) => ({
                              ...prev,
                              founders: prev.founders.map((f, i) =>
                                i === index ? { ...f, email: e.target.value } : f
                              ),
                            }))
                          }
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                    {dealFlow.founders.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveFounder(index)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove Founder
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={onAddFounder}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Another Founder
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  value={dealFlow.website}
                  onChange={(e) => setDealFlow({ ...dealFlow, website: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Company website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Relationship
                </label>
                <textarea
                  value={dealFlow.lp_relationship}
                  onChange={(e) => setDealFlow({ ...dealFlow, lp_relationship: e.target.value })}
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Describe your relationship with this company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company LinkedIn
                </label>
                <input
                  value={dealFlow.linkedin}
                  onChange={(e) => setDealFlow({ ...dealFlow, linkedin: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Company LinkedIn URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={dealFlow.description}
                  onChange={(e) => setDealFlow({ ...dealFlow, description: e.target.value })}
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Brief description of the company"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t p-6">
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmitDeal(dealFlow, currentFundId);
                    onClose();
                  }}
                >
                  Submit Referral
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Past Referrals */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Past Referrals</h3>
              <p className="text-sm text-gray-500 mt-1">Your previous referrals to this fund</p>
            </div>

            {/* Past Referrals Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {referralsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse border rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
                             ) : pastReferrals.length > 0 ? (
                 <div className="space-y-4">
                   {pastReferrals.map((referral, index) => (
                     <div key={referral.referralUUID || index} className="border rounded-lg p-4 hover:bg-gray-50">
                       <div className="flex items-center justify-between mb-2">
                         <h4 className="font-medium">{referral.companyInfo?.companyName || 'Unnamed Company'}</h4>
                         <Badge variant={referral.state === 'Interested' ? 'default' : 'secondary'}
                           className={`${
                             referral.state === 'New'
                               ? 'bg-blue-900/30 text-blue-300'
                               : referral.state === 'Reviewing'
                                 ? 'bg-yellow-900/30 text-yellow-300'
                                 : referral.state === 'Meeting'
                                   ? 'bg-purple-900/30 text-purple-300'
                                   : referral.state === 'Interested'
                                     ? 'bg-green-900/30 text-green-300'
                                     : 'bg-gray-900/30 text-gray-300'
                           }`}
                         >
                           {referral.state || 'New'}
                         </Badge>
                       </div>
                       {referral.companyInfo?.description && (
                         <p className="text-sm text-gray-600 mb-3">{referral.companyInfo.description}</p>
                       )}
                       <div className="mb-3">
                         <p className="text-xs text-gray-500 font-medium">Your Relationship:</p>
                         <p className="text-sm text-gray-700">{referral.LPRelationshipDesc}</p>
                       </div>
                       {referral.companyInfo?.founders && referral.companyInfo.founders.length > 0 && (
                         <div className="mb-3">
                           <p className="text-xs text-gray-500 font-medium">Founders:</p>
                           <div className="mt-1">
                             {referral.companyInfo.founders.map((founder, founderIndex) => (
                               <div key={founderIndex} className="text-sm text-gray-700">
                                 {founder.name}
                                 {founder.email && (
                                   <span className="text-gray-500"> • {founder.email}</span>
                                 )}
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
                       <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-4 text-xs text-gray-500">
                           <div className="flex items-center">
                             <Calendar className="h-3 w-3 mr-1" />
                             {referral.createdAt ? new Date(referral.createdAt).toLocaleDateString() : 'Date unknown'}
                           </div>
                         </div>
                         <div className="flex items-center space-x-2">
                           {referral.companyInfo?.companyWebsite && (
                             <a 
                               href={referral.companyInfo.companyWebsite}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center text-blue-500 hover:text-blue-600 text-xs"
                             >
                               <ExternalLink className="h-3 w-3 mr-1" />
                               Website
                             </a>
                           )}
                           {referral.companyInfo?.linkedinURL && referral.companyInfo.linkedinURL !== 'stealth' && (
                             <a 
                               href={referral.companyInfo.linkedinURL}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center text-blue-500 hover:text-blue-600 text-xs"
                             >
                               <Building className="h-3 w-3 mr-1" />
                               LinkedIn
                             </a>
                           )}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No past referrals found</p>
                  <p className="text-sm">Your referrals will appear here once submitted</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function AnnouncementsModal({ isOpen, onClose, announcements, currentFundId }) {
  const [replyText, setReplyText] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [isReplying, setIsReplying] = useState(false)

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement)
  }

  const handleBackToList = () => {
    setSelectedAnnouncement(null)
    setReplyText("")
    setIsReplying(false)
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    
    // TODO: Implement reply API call when endpoint is available
    // const replyData = {
    //   announcement_id: selectedAnnouncement.ann_id,
    //   fund_id: currentFundId,
    //   lp_uuid: localStorage.getItem("userId"),
    //   reply_message: replyText,
    //   reply_date: new Date().toISOString()
    // }
    
    console.log("Reply to be sent:", {
      announcement_id: selectedAnnouncement?.ann_id,
      fund_id: currentFundId,
      lp_uuid: localStorage.getItem("userId"),
      reply_message: replyText,
      reply_date: new Date().toISOString()
    })

    // Simulate API call
    alert("Reply functionality will be implemented when the endpoint is available")
    setReplyText("")
    setIsReplying(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-4xl bg-white border-l shadow-xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {!selectedAnnouncement ? (
            // Announcements List View
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">All Announcements</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Announcements List */}
              <div className="flex-1 overflow-y-auto p-6">
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement, i) => (
                      <div 
                        key={announcement.ann_id || i} 
                        className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-6 border border-gray-200 cursor-pointer"
                        onClick={() => handleAnnouncementClick(announcement)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                          <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                            {new Date(announcement.date).toLocaleDateString()}
                          </span>
                        </div>
                        {announcement.subject && (
                          <p className="text-sm font-medium text-gray-700 mb-2">{announcement.subject}</p>
                        )}
                        <p className="text-gray-600 leading-relaxed line-clamp-3">
                          {announcement.message || announcement.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-500">Click to view details and reply</span>
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg text-gray-500">No announcements available</p>
                    <p className="text-sm text-gray-400 mt-1">Updates will appear here when posted</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Single Announcement Detail View
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleBackToList}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-xl font-semibold">{selectedAnnouncement.title}</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Announcement Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(selectedAnnouncement.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    {selectedAnnouncement.subject && (
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{selectedAnnouncement.subject}</h3>
                    )}
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedAnnouncement.message || selectedAnnouncement.description}
                      </p>
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Reply to this announcement</h4>
                    
                    {!isReplying ? (
                      <button
                        onClick={() => setIsReplying(true)}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Write a reply
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply here..."
                          rows="4"
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                        />
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={handleReply}
                            disabled={!replyText.trim()}
                            className="inline-flex items-center"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsReplying(false)
                              setReplyText("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Note: Reply functionality will be implemented when the backend endpoint is available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}