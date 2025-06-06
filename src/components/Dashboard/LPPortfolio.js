"use client"

import { motion } from "framer-motion"
import { DashboardNav } from "./DashboardNav"
import { PieChart } from "lucide-react"
import { Footer } from "../Common/Footer"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import { useNavigate } from "react-router-dom"

export const LPPortfolio = () => {
  const userId = localStorage.getItem("userId")
  const [portfolioStats, setPortfolioStats] = useState({
    totalInvested: "0",
    totalValue: "0",
    totalReturn: "N/A",
    activeInvestments: "0"
  })
  const [investments, setInvestments] = useState([])
  const [investmentsLoading , setInvestmentsLoading] = useState(true)
  const [dealFlow, setDealFlow] = useState({
    lp_uuid: localStorage.getItem("userId") || "",
    gp_uuid: localStorage.getItem("fund") || "",
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
                  expanded: false
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
      const announcements = await fetchAnnouncements(investment.announcementIds);
      const updatedInvestments = investments.map((inv, i) =>
        i === index ? { ...inv, announcements, expanded: true } : inv
      );
      setInvestments(updatedInvestments);
    } else {
      const updatedInvestments = investments.map((inv, i) =>
        i === index ? { ...inv, expanded: false } : inv
      );
      setInvestments(updatedInvestments);
    }
  };

   // Deal Submission Logic
   const handleDealSubmission = async (dealData) => {
    try {
      const response = await fetch(
        "https://limitless-backend.vercel.app/api/provide-referral-deal-flow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dealData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Deal submitted successfully:", result);
        alert("Deal submitted successfully!");
        navigate("lp-portfolio"); // Redirect to the portfolio page after submission
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav currentPage={"Portfolio"} />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="bg-black text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-extralight mb-4">Your Limitless Portfolio</h1>
              <p className="text-gray-400">Track your investments and performance</p>
            </motion.div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Invested</p>
                  <h3 className="text-2xl font-semibold">{portfolioStats.totalInvested}</h3>
                </div>
                <PieChart className="h-8 w-8 text-gray-400" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <h3 className="text-2xl font-semibold">{portfolioStats.totalValue}</h3>
                </div>
                <PieChart className="h-8 w-8 text-gray-400" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Return</p>
                  <h3 className="text-2xl font-semibold">{portfolioStats.totalReturn}</h3>
                </div>
                <PieChart className="h-8 w-8 text-gray-400" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Investments</p>
                  <h3 className="text-2xl font-semibold">{portfolioStats.activeInvestments}</h3>
                </div>
                <PieChart className="h-8 w-8 text-gray-400" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Active Investments */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
          <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Exit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
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
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowExpand(index)}
                      >
                        <td className="px-6 py-4 text-center">
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
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{investment.fundName}</div>
                            <div className="text-sm text-gray-500">{investment.firm}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{investment.investedAmount}</td>
                        <td className="px-6 py-4">
                          <span className="text-green-600">{investment.return}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{investment.exitDate}</td>
                      </motion.tr>
                      {investment.expanded && (
                        <tr className="bg-gray-100">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="flex flex-wrap gap-6">
                              {/* Left Section: Stats */}
                              <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-700 mb-4">Info</h4>
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="bg-white shadow rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-700">Categories</h4>
                                    <p className="text-gray-900">{investment.categories.join(", ")}</p>
                                  </div>
                                  <div className="bg-white shadow rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-700">Minimum Investment</h4>
                                    <p className="text-gray-900">{investment.minInvestment}</p>
                                  </div>
                                  <div className="bg-white shadow rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-700">Fund Size</h4>
                                    <p className="text-gray-900">{investment.fundSize}</p>
                                  </div>
                                  <div className="bg-white shadow rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-700">Management Fee</h4>
                                    <p className="text-gray-900">{investment.managementFee}</p>
                                  </div>
                                  <div className="bg-white shadow rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-700">Capital Call</h4>
                                    <p className="text-gray-900">{investment.capitalCall}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Right Section: Announcements */}
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-gray-700 mb-4">Announcements</h4>
                                {investment.announcements.length > 0 ? (
                                  <div className="grid grid-cols-1 gap-4">
                                    {investment.announcements.map((announcement, i) => (
                                      <div key={i} className="bg-white shadow rounded-lg p-4">
                                        <h5 className="text-sm font-medium text-gray-700">{announcement.title}</h5>
                                        <p className="text-gray-500 text-sm">{announcement.date}</p>
                                        <p className="text-gray-900 mt-2">{announcement.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500">No announcements available.</p>
                                )}
                              </div>

                              {/* Deal Flow Section */}
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-gray-700 mb-4">Company Referral</h4>
                                <div className="bg-white shadow rounded-lg p-4 space-y-2">
                                    <div>
                                      <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                                        Company Name
                                      </label>
                                      <input
                                        value={dealFlow.company_name}
                                        onChange={(e) => setDealFlow({ ...dealFlow, company_name: e.target.value })}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                                                  rounded-lg p-1 m-1 text-sm text-black dark:text-white placeholder:text-gray-500
                                                  focus:outline-none focus:border-blue-500/50 transition-colors"
                                      />
                                    </div>
                                    <div className="w-full ml-1 my-2 p-4 border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800">
                                    {dealFlow.founders.map((founder, index) => (
                                        <div key={index} className="mb-4 ml-1 mt-1 p-4 border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800">
                                        <div>
                                          <label htmlFor={`founder${index}Name`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Founder {index + 1} Name
                                          </label>
                                          <input
                                            type="text"
                                            name={`founder${index}Name`}
                                            id={`founder${index}Name`}
                                            value={founder.name}
                                            onChange={(e) =>
                                              setDealFlow((prevDealFlow) => ({
                                                ...prevDealFlow,
                                                founders: prevDealFlow.founders.map((f, i) =>
                                                  i === index ? { ...f, name: e.target.value } : f
                                                ),
                                              }))
                                            }
                                            required
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                                            rounded-lg p-1 m-1 text-sm text-black dark:text-white placeholder:text-gray-500
                                            focus:outline-none focus:border-blue-500/50 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor={`founder${index}Linkedin`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Founder {index + 1} LinkedIn
                                          </label>
                                          <input
                                            type="url"
                                            name={`founder${index}Linkedin`}
                                            id={`founder${index}Linkedin`}
                                            value={founder.linkedin}
                                            onChange={(e) =>
                                              setDealFlow((prevDealFlow) => ({
                                                ...prevDealFlow,
                                                founders: prevDealFlow.founders.map((f, i) =>
                                                  i === index ? { ...f, linkedin: e.target.value } : f
                                                ),
                                              }))
                                            }
                                            required
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                                            rounded-lg p-1 m-1 text-sm text-black dark:text-white placeholder:text-gray-500
                                            focus:outline-none focus:border-blue-500/50 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor={`founder${index}Email`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Founder {index + 1} Email
                                          </label>
                                          <input
                                            type="email"
                                            name={`founder${index}Email`}
                                            id={`founder${index}Email`}
                                            value={founder.email}
                                            onChange={(e) =>
                                              setDealFlow((prevDealFlow) => ({
                                                ...prevDealFlow,
                                                founders: prevDealFlow.founders.map((f, i) =>
                                                  i === index ? { ...f, email: e.target.value } : f
                                                ),
                                              }))
                                            }
                                            required
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                                            rounded-lg p-1 m-1 text-sm text-black dark:text-white placeholder:text-gray-500
                                            focus:outline-none focus:border-blue-500/50 transition-colors"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveFounder(index)}
                                          className="mt-4 inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                          ×
                                        </button>
                                      </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={handleAddFounder}
                                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      >
                                        Add Founder
                                      </button>
                                    </div>
                                    <div>
                                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                        Website
                                      </label>
                                      <input
                                        // type="url"
                                        name="website"
                                        id="website"
                                        required
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                                        rounded-lg p-1 m-1 text-sm text-black dark:text-white placeholder:text-gray-500
                                        focus:outline-none focus:border-blue-500/50 transition-colors" 
                                        onChange={(e) => setDealFlow({ ...dealFlow, website: e.target.value }) }                                    
                                        />
                                    </div>
                                    <div>
                                      <label htmlFor="lp_relationship" className="block text-sm font-medium text-gray-700">
                                        LP Relationship
                                      </label>
                                      <textarea
                                        name="lp_relationship"
                                        id="lp_relationship"
                                        required
                                        rows="3"
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                                        rounded-lg p-1 m-1 text-sm text-black dark:text-white placeholder:text-gray-500
                                        focus:outline-none focus:border-blue-500/50 transition-colors"
                                        onChange={(e) => setDealFlow({ ...dealFlow, lp_relationship: e.target.value }) }
                                      ></textarea>
                                    </div>
                                    <div>
                                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                                        Company LinkedIn
                                      </label>
                                      <input
                                        name="linkedin"
                                        id="linkedin"
                                        required
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                                        rounded-lg p-1 m-1 text-sm text-black dark:text-white placeholder:text-gray-500
                                        focus:outline-none focus:border-blue-500/50 transition-colors"
                                        onChange={(e) => setDealFlow({ ...dealFlow, linkedin: e.target.value }) }
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                      </label>
                                      <textarea
                                        name="description"
                                        id="description"
                                        required
                                        rows="3"
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 
                                        rounded-lg p-1 m-1 text-sm text-black dark:text-white placeholder:text-gray-500
                                        focus:outline-none focus:border-blue-500/50 transition-colors"
                                        onChange={(e) => setDealFlow({ ...dealFlow, description: e.target.value }) }
                                      ></textarea>
                                    </div>
                                    <button
                                      type="submit"
                                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleDealSubmission(dealFlow);
                                      }}
                                    >
                                      Submit Referral
                                    </button>
                                </div>
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}