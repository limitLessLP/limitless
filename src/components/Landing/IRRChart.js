"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { Year: 2003, VC: 30.5, PE: 25.0, Stocks: 28.68, Bonds: 4.1 },
  { Year: 2004, VC: 28.0, PE: 22.0, Stocks: 10.88, Bonds: 4.34 },
  { Year: 2005, VC: 25.0, PE: 20.0, Stocks: 4.91, Bonds: 2.43 },
  { Year: 2006, VC: 27.5, PE: 23.0, Stocks: 15.79, Bonds: 4.33 },
  { Year: 2007, VC: 26.0, PE: 21.0, Stocks: 5.49, Bonds: 6.97 },
  { Year: 2008, VC: -5.0, PE: -3.0, Stocks: -37.0, Bonds: 5.24 },
  { Year: 2009, VC: 35.0, PE: 28.0, Stocks: 26.46, Bonds: 5.93 },
  { Year: 2010, VC: 32.0, PE: 25.0, Stocks: 15.06, Bonds: 6.54 },
  { Year: 2011, VC: 20.0, PE: 18.0, Stocks: 2.11, Bonds: 7.84 },
  { Year: 2012, VC: 25.5, PE: 22.0, Stocks: 16.0, Bonds: 4.22 },
  { Year: 2013, VC: 35.0, PE: 30.0, Stocks: 32.39, Bonds: -2.02 },
  { Year: 2014, VC: 28.0, PE: 25.0, Stocks: 13.69, Bonds: 5.97 },
  { Year: 2015, VC: 22.0, PE: 20.0, Stocks: 1.38, Bonds: 0.55 },
  { Year: 2016, VC: 24.0, PE: 22.0, Stocks: 11.96, Bonds: 2.65 },
  { Year: 2017, VC: 30.0, PE: 28.0, Stocks: 21.83, Bonds: 3.54 },
  { Year: 2018, VC: 15.0, PE: 12.0, Stocks: -4.38, Bonds: 0.01 },
  { Year: 2019, VC: 25.0, PE: 22.0, Stocks: 31.49, Bonds: 8.72 },
  { Year: 2020, VC: 35.0, PE: 30.0, Stocks: 18.4, Bonds: 7.51 },
  { Year: 2021, VC: 40.0, PE: 35.0, Stocks: 28.71, Bonds: -1.54 },
  { Year: 2022, VC: 10.0, PE: 8.0, Stocks: -18.11, Bonds: -13.02 },
  { Year: 2023, VC: 18.0, PE: 15.0, Stocks: 26.29, Bonds: 5.5 }
];

const averages = [
  { Asset: "VC", Average: 25.07 },
  { Asset: "PE", Average: 21.33 },
  { Asset: "Stocks", Average: 12.00 },
  { Asset: "Bonds", Average: 3.32 }
];


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
    PE: "#ffffff", // White
    Stocks: "#ffffff", // White
    Bonds: "#ffffff", // White
  }


  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg z-1000 text-white snap-start">
      <div className="mb-8">
        <h3 className="text-2xl font-light mb-4">Internal Rate of Return (IRR) Comparison</h3>
        <p className="text-gray-400 font-light text-white">
          Venture Capital consistently outperforms other asset classes over the past decade.
        </p>
      </div>

      <div className="h-[275px]">
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
            <p className={`text-2xl ${key === "VC" ? "font-bold" : "font-light"}`} style={{ color }}>
              {averages.find(entry => entry.Asset === key).Average}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Average IRR</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 