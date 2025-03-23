import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export const PortfolioChart = () => {
  const data = [
    { month: "Jan", value: 1000000 },
    { month: "Feb", value: 1200000 },
    { month: "Mar", value: 1150000 },
    { month: "Apr", value: 1400000 },
    { month: "May", value: 1600000 },
    { month: "Jun", value: 2400000 },
  ]

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis
            stroke="#6b7280"
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`, "Portfolio Value"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#000000"
            strokeWidth={2}
            dot={{ fill: "#000000" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 