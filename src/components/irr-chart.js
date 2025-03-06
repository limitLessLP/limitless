"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { year: "2013", VC: 25.9, PE: 14.2, Stocks: 9.5, Bonds: 3.2 },
  { year: "2014", VC: 27.1, PE: 15.3, Stocks: 10.2, Bonds: 3.5 },
  { year: "2015", VC: 24.8, PE: 13.9, Stocks: 8.7, Bonds: 2.9 },
  { year: "2016", VC: 26.3, PE: 14.7, Stocks: 11.3, Bonds: 3.1 },
  { year: "2017", VC: 29.5, PE: 16.2, Stocks: 12.8, Bonds: 3.3 },
  { year: "2018", VC: 28.7, PE: 15.8, Stocks: 9.8, Bonds: 3.0 },
  { year: "2019", VC: 30.2, PE: 16.5, Stocks: 13.5, Bonds: 3.6 },
  { year: "2020", VC: 32.4, PE: 17.1, Stocks: 14.2, Bonds: 3.8 },
  { year: "2021", VC: 35.8, PE: 18.3, Stocks: 15.7, Bonds: 3.4 },
  { year: "2022", VC: 33.5, PE: 17.6, Stocks: 12.1, Bonds: 3.2 },
  { year: "2023", VC: 34.9, PE: 18.1, Stocks: 14.8, Bonds: 3.7 },
]

export function IRRChart() {
  const [hoveredAsset, setHoveredAsset] = useState(null)

  // const assetColors = {
  //   VC: "hsl(var(--chart-1))",
  //   PE: "hsl(var(--chart-2))",
  //   Stocks: "hsl(var(--chart-3))",
  //   Bonds: "hsl(var(--chart-4))",
  // }

  const assetColors = {
    VC: "hsl(142, 76%, 36%)", // Green
    PE: "#000000", // Black
    Stocks: "#000000", // Black
    Bonds: "#000000", // Black
  }


  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="mb-8">
        <h3 className="text-2xl font-light mb-4">Internal Rate of Return (IRR) Comparison</h3>
        <p className="text-gray-400 font-light">
          Venture Capital consistently outperforms other asset classes over the past decade.
        </p>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              label={{ 
                value: "IRR (%)", 
                angle: -90, 
                position: "insideLeft",
                style: { fill: "rgba(255,255,255,0.7)" }
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Legend 
              onMouseEnter={(e) => setHoveredAsset(e.dataKey)}
              onMouseLeave={() => setHoveredAsset(null)}
            />
            {Object.entries(assetColors).map(([key, color]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={hoveredAsset === key ? 3 : 2}
                dot={{ r: 4, strokeWidth: 1 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                opacity={hoveredAsset ? (hoveredAsset === key ? 1 : 0.3) : 1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {Object.entries(assetColors).map(([key, color]) => (
          <motion.div
            key={key}
            className="bg-white/5 rounded-lg p-4 text-center"
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setHoveredAsset(key)}
            onMouseLeave={() => setHoveredAsset(null)}
            style={{
              borderColor: color,
              borderWidth: hoveredAsset === key ? "2px" : "1px",
              opacity: hoveredAsset ? (hoveredAsset === key ? 1 : 0.3) : 1,
            }}
          >
            <h4 className="text-lg font-medium mb-1">{key}</h4>
            <p className="text-2xl font-light" style={{ color }}>
              {data[data.length - 1][key]}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Average IRR</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 