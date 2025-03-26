import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const CurrentOfferings = () => {
  const navigate = useNavigate()
  
  const offerings = [
    {
      id: 1,
      firm: "Pioneer VC",
      name: "Fund Manager: Dave Messina, General Partner",
      focus: "Bio & Health, including therapeutics and healthcare companies",
      target: "50MM (Allocation: 1MM)",
      deadline: "Mid-June, 2025",
      minimumInvestment: "$25k",
      feeStructure: "3/20 (3% Management Fee and 20% Carried Interest)",
      investorRequirement: "Qualified purchasers only (5M in assets)",
      capitalCall: "Schedule TBD",
      timeline: "5-10 years before fund exit",
      redirect: "/pioneer",
    },
    {
      id: 2,
      firm: "Republic VC",
      name: "Fund Manager: Sophie Liao, General Partner",
      focus: "AI, Fintech, Consumers",
      target: "~50MM (Allocation: 1MM)",
      deadline: "TBD",
      minimumInvestment: "$25k",
      feeStructure: "3/20 (3% Management Fee and 20% Carried Interest)",
      investorRequirement: "Qualified purchasers only (5M in assets)",
      capitalCall: "Schedule TBD",
      timeline: "5-10 years before fund exit",
      redirect: "/republic",
    },
    {
      id: 3,
      firm: "LoLa Capital",
      name: "Fund Managers: Greg Verdine, Circe Lyu, Sashank Reddy",
      focus: "Life Sciences, including Therapeutics and Medical Devices",
      target: "200MM (Allocation: 5MM)",
      deadline: "June 30, 2025",
      minimumInvestment: "$50k",
      feeStructure: "3.5/20 (3.5% Management Fee and 20% Carried Interest)",
      investorRequirement: "Qualified purchasers only (5M in assets)",
      capitalCall: "Schedule TBD",
      timeline: "10-12 years before fund exit",
      redirect: "/lola",
    },
  ];

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Current Offerings</h2>
        <button
          onClick={() => navigate("/offerings")}
          className="text-gray-500 hover:text-gray-700"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {offerings.map((offering, index) => (
          <motion.div
            key={offering.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {offering.firm}
                </h3>
                <p className="text-sm text-gray-600">{offering.name}</p>
              </div>
              <button className="text-black hover:bg-gray-50 rounded-full p-2 transition-colors">
                <ArrowRight
                  className="h-5 w-5"
                  onClick={() => navigate(offering.redirect)}
                />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Target Size</p>
                <p className="text-sm font-medium">{offering.target}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Focus</p>
                <p className="text-sm font-medium">{offering.focus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="text-sm font-medium">{offering.deadline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Minimum Investment</p>
                <p className="text-sm font-medium">{offering.minimumInvestment}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fee Structure</p>
                <p className="text-sm font-medium">{offering.feeStructure}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Investor Requirement</p>
                <p className="text-sm font-medium">{offering.investorRequirement}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Capital Call</p>
                <p className="text-sm font-medium">{offering.capitalCall}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timeline</p>
                <p className="text-sm font-medium">{offering.timeline}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 