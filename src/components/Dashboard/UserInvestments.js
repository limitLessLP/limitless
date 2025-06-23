import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  TrendingUp,
  Clock,
  Users,
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button.tsx";
import { Badge } from "../../ui/badge.tsx";

export const UserInvestments = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [investments, setInvestments] = useState([]);
  const [activeTab, setActiveTab] = useState('fund-investments'); // 'fund-investments', 'co-investments'
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
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
      if (data && data.investments) {
        setInvestments(data.investments);
      } else {
        console.error("Failed to fetch investments:", data.message);
        setInvestments([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const getFundInvestments = () => {
    return investments.filter(inv => inv.type === 'FUND_INVESTMENT');
  };

  const getCoInvestments = () => {
    return investments.filter(inv => inv.type === 'CO_INVESTMENT');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'OPEN':
        return 'default';
      case 'FULL':
        return 'secondary';
      case 'CLOSED':
        return 'destructive';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'outline';
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

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'fund-investments' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('fund-investments')}
          className="flex-1"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Fund Investments
        </Button>
        <Button
          variant={activeTab === 'co-investments' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('co-investments')}
          className="flex-1"
        >
          <Users className="h-4 w-4 mr-2" />
          Co-Investments
        </Button>
      </div>

      {/* Fund Investments Tab */}
      {activeTab === 'fund-investments' && (
        <div className="flex overflow-x-auto gap-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="min-w-[300px] bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex-shrink-0 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : getFundInvestments().length > 0 ? (
            getFundInvestments().map((investment, index) => (
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
                      {investment.vehicle.fundName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Invested: {formatCurrency(investment.investment.commitment_amount)}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-5 w-5 text-gray-700 cursor-pointer"
                    onClick={() => navigate("/lp-portfolio")}
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {investment.vehicle.categories.map((tag, idx) => (
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
                        {formatCurrency(investment.vehicle.financials.fundSize)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span>
                      Capital Call:{" "}
                      <span className="text-base font-medium">
                        {investment.vehicle.timelines.capitalCallSchedule?.[0]
                          ? formatDate(investment.vehicle.timelines.capitalCallSchedule[0])
                          : "N/A"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Mgmt Fee: {investment.vehicle.financials.managementFee}%</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="w-full text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No fund investments found</p>
              <p className="text-sm text-gray-400">Start investing in funds to see them here</p>
            </div>
          )}
        </div>
      )}

      {/* Co-Investments Tab */}
      {activeTab === 'co-investments' && (
        <div className="flex overflow-x-auto gap-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="min-w-[300px] bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex-shrink-0 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : getCoInvestments().length > 0 ? (
            getCoInvestments().map((investment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[300px] bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Co-Investment
                      </h3>
                      <Badge variant={getStatusBadgeVariant(investment.vehicle.status)}>
                        {investment.vehicle.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Invested: {formatCurrency(investment.investment.commitment_amount)}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-5 w-5 text-gray-700 cursor-pointer"
                    onClick={() => navigate("/lp-portfolio")}
                  />
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span>
                      Total Allocation:{" "}
                      <span className="text-base font-medium">
                        {formatCurrency(investment.vehicle.total_allocation)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>
                      Funds Collected:{" "}
                      <span className="text-base font-medium">
                        {formatCurrency(investment.vehicle.funds_collected)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span>
                      Closing Date:{" "}
                      <span className="text-base font-medium">
                        {formatDate(investment.vehicle.closing_date)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      LPs Registered:{" "}
                      <span className="text-base font-medium">
                        {investment.vehicle.lp_uuids?.length || 0}
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="w-full text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No co-investments found</p>
              <p className="text-sm text-gray-400">Participate in co-investment opportunities to see them here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
