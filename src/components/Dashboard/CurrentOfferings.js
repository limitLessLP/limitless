import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, DollarSign, User, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CurrentOfferings = () => {
  const navigate = useNavigate();

  const offerings = [
    {
      id: 1,
      firm: "Pioneer VC",
      manager: "Dave Messina, GP",
      focusTags: ["BioTech"],
      focus: "Bio & Health",
      minInvestment: "$25K",
      targetSize: "$50MM",
      deadline: "Mid-June 2025",
      timeline: "5–10 yr",
    },
    {
      id: 2,
      firm: "Republic VC",
      manager: "Sophie Liao, GP",
      focusTags: ["FinTech", "FBTC+", "Consumers"],
      focus: "AI, Fintech, Consumers",
      minInvestment: "$25K",
      targetSize: "~$50MM",
      deadline: "TBD",
      timeline: "5–10 yr",
    },
    {
      id: 3,
      firm: "LoLa Capital",
      manager: "Greg Verdine (GP), Circe Lyu, Sashank Reddy",
      focusTags: ["BioTech"],
      focus: "Life Sciences",
      minInvestment: "$50K",
      targetSize: "$200MM",
      deadline: "June 30 2025",
      timeline: "10–12 yr",
    },
  ];

  return (
    <div className="mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Current Offerings</h2>
        <button
          onClick={() => navigate("/offerings")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offerings.map((offering, index) => (
          <motion.div
            key={offering.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{offering.firm}</h3>
                <p className="text-sm text-gray-600 mt-1">{offering.manager}</p>
              </div>
              <ArrowRight
                className="h-5 w-5 text-gray-700 cursor-pointer"
                onClick={() => navigate("/offerings")}
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {offering.focusTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-sm font-medium text-gray-700 px-2 py-0.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-base font-medium">{offering.focus}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Min. Investment: <span className="text-base font-medium">{offering.minInvestment}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span>Target Size: <span className="text-base font-medium">{offering.targetSize}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <span>Deadline: <span className="text-base font-medium">{offering.deadline}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{offering.timeline}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
