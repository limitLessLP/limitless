import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  TrendingUp,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserInvestments = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [investments, setInvestments] = useState([]);

  const fetchInvestments = async () => {
    try {
      const res = await fetch(
        `https://limitless-backend.vercel.app/api/get-lp-investments?id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      const data = await res.json();
        if (data) {
        const mappedInvestments = data.funds.map((investment) => {
            const fund = investment.Fund;
            const investmentDetails = investment.Investment;
            
            return {
                fundName: fund.fundName,
                categories: fund.categories,
                investedAmount: `$${investmentDetails.commitment_amount.toLocaleString()}`,
                minInvestment: `$${fund.financials.minInvestment.toLocaleString()}`,
                fundSize: `$${fund.financials.fundSize.toLocaleString()}`,
                managementFee: `${fund.financials.managementFee}%`,
                capitalCall: fund.timelines.capitalCallSchedule?.[0]
                ? new Date(fund.timelines.capitalCallSchedule[0]).toDateString()
                : "N/A"
            };
        });
        setInvestments(mappedInvestments);
        } else {
        console.error("Failed to fetch investments:", data.message);
        }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return (
    <div className="mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Investments</h2>
        <button
          onClick={() => navigate("/lp-portfolio")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          View Portfolio
        </button>
      </div>

      <div className="flex overflow-x-auto gap-4">
        {investments.map((investment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[300px] bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {investment.fundName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Invested: {investment.investedAmount}
                </p>
              </div>
              <ArrowRight
                className="h-5 w-5 text-gray-700 cursor-pointer"
                onClick={() => navigate("/lp-portfolio")}
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {investment.categories.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-sm font-medium text-gray-700 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span>
                  Fund Size:{" "}
                  <span className="text-base font-medium">
                    {investment.fundSize}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <span>
                  Capital Call:{" "}
                  <span className="text-base font-medium">
                    {investment.capitalCall}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Mgmt Fee: {investment.managementFee}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
