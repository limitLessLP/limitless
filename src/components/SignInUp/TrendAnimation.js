"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Multiple upward trend patterns with different characteristics
const bullishPatterns = [
  {
    name: "Steady Growth",
    description: "Consistent upward movement",
    color: "hsl(142.1 76.2% 36.3%)",
    data: [
      { date: "Jan", price: 150, volume: 1200 },
      { date: "Feb", price: 160, volume: 1300 },
      { date: "Mar", price: 170, volume: 1400 },
      { date: "Apr", price: 180, volume: 1500 },
      { date: "May", price: 190, volume: 1600 },
      { date: "Jun", price: 200, volume: 1700 },
      { date: "Jul", price: 210, volume: 1800 },
      { date: "Aug", price: 220, volume: 1900 },
      { date: "Sep", price: 230, volume: 2000 },
      { date: "Oct", price: 240, volume: 2100 },
    ],
  },
  {
    name: "",
    description: "Increasing momentum over time",
    color: "hsl(160 84% 39%)",
    data: [
      { date: "Jan", price: 150, volume: 1200 },
      { date: "Feb", price: 155, volume: 1250 },
      { date: "Mar", price: 165, volume: 1350 },
      { date: "Apr", price: 180, volume: 1500 },
      { date: "May", price: 200, volume: 1700 },
      { date: "Jun", price: 225, volume: 1900 },
      { date: "Jul", price: 255, volume: 2200 },
      { date: "Aug", price: 290, volume: 2500 },
      { date: "Sep", price: 330, volume: 2800 },
      { date: "Oct", price: 375, volume: 3200 },
    ],
  },
  {
    name: "Growth with Pullbacks",
    description: "Upward trend with minor corrections",
    color: "hsl(125 65% 40%)",
    data: [
      { date: "Jan", price: 150, volume: 1200 },
      { date: "Feb", price: 170, volume: 1400 },
      { date: "Mar", price: 165, volume: 1350 },
      { date: "Apr", price: 190, volume: 1600 },
      { date: "May", price: 185, volume: 1550 },
      { date: "Jun", price: 210, volume: 1800 },
      { date: "Jul", price: 200, volume: 1700 },
      { date: "Aug", price: 230, volume: 2000 },
      { date: "Sep", price: 225, volume: 1950 },
      { date: "Oct", price: 260, volume: 2300 },
    ],
  },
  {
    name: "Breakout Growth",
    description: "Sideways then strong upward movement",
    color: "hsl(134 61% 41%)",
    data: [
      { date: "Jan", price: 150, volume: 1200 },
      { date: "Feb", price: 155, volume: 1250 },
      { date: "Mar", price: 152, volume: 1220 },
      { date: "Apr", price: 158, volume: 1280 },
      { date: "May", price: 155, volume: 1250 },
      { date: "Jun", price: 160, volume: 1300 },
      { date: "Jul", price: 190, volume: 1600 },
      { date: "Aug", price: 220, volume: 1900 },
      { date: "Sep", price: 250, volume: 2200 },
      { date: "Oct", price: 290, volume: 2600 },
    ],
  },
]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
        <p className="font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-bold text-green-600 dark:text-green-400">${payload[0].value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Volume: {payload[0].payload.volume.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export const TrendAnimation = () => {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [data, setData] = useState([])
  const [isAnimating, setIsAnimating] = useState(true)
  const [percentIncrease, setPercentIncrease] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [animationComplete, setAnimationComplete] = useState(false)

  const selectRandomPattern = () => {
    const randomIndex = Math.floor(Math.random() * bullishPatterns.length)
    setCurrentPatternIndex(randomIndex)
    return randomIndex
  }

  useEffect(() => {
    if (data.length >= 2) {
      const pattern = bullishPatterns[currentPatternIndex]
      const startPrice = pattern.data[0].price
      const currentPrice = data[data.length - 1].price
      const increase = ((currentPrice - startPrice) / startPrice) * 100
      setPercentIncrease(increase)
    }
  }, [data, currentPatternIndex])

  useEffect(() => {
    if (isAnimating) {
      const pattern = bullishPatterns[currentPatternIndex];
  
      const interval = setInterval(() => {
        setData((prevData) => {
          if (prevData.length >= pattern.data.length) {
            clearInterval(interval);
            setAnimationComplete(true);
            
            setTimeout(() => {
              setAnimationComplete(false);
              setIsAnimating(true);
              setData([]); 
              setCurrentPatternIndex((prevIndex) => (prevIndex + 1) % bullishPatterns.length);
            }, 1000); 
  
            return prevData;
          }
          return [...prevData, pattern.data[prevData.length]];
        });
      }, 300);
  
      return () => clearInterval(interval);
    }
  }, [isAnimating, currentPatternIndex]); 
  

  useEffect(() => {
    selectRandomPattern()
  }, [])

  const restartAnimation = () => {
    setData([]);
    setAnimationComplete(false);
    setIsAnimating(true);
    setCurrentPatternIndex((prevIndex) => (prevIndex + 1) % bullishPatterns.length);
  };
  

  const currentPattern = bullishPatterns[currentPatternIndex]

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div
        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        onClick={restartAnimation}
      >
        <div className="p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              ABC Inc. <TrendingUp className="h-5 w-5 text-green-500" />
            </h3>
            {/* <p className="text-sm text-muted-foreground">
              {currentPattern ? currentPattern.name : "Loading..."}: {currentPattern?.description}
            </p> */}
          </div>
          {data.length >= 0 && (
            <motion.div
              key={currentPatternIndex} // Re-animate when pattern changes
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span className="font-medium">+{percentIncrease.toFixed(2)}%</span>
            </motion.div>
          )}
        </div>

        <div className="h-[300px] w-full min-h-[300px] min-w-[400px]">
          {currentPattern && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentPattern.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={currentPattern.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888", fontSize: 12 }}
                  domain={["Jan", "Oct"]}
                  ticks={currentPattern.data.map((item) => item.date)}
                />
                <YAxis
                  domain={[(dataMin) => Math.floor(dataMin * 0.9), (dataMax) => Math.ceil(dataMax * 1.1)]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888", fontSize: 12 }}
                  width={40}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={currentPattern.color}
                  fillOpacity={1}
                  fill="url(#colorGradient)"
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* <div className="p-4 flex justify-between items-center text-sm text-muted-foreground">
          <div>
            {animationComplete
              ? "Pattern complete. Auto-cycling soon... Click to change now."
              : "Animation in progress..."}
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span>ACME (NYSE)</span>
          </div>
        </div> */}
      </div>

      {data.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          {/* <motion.div
            key={`start-${currentPatternIndex}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg"
          >
            <span className="text-muted-foreground mr-2">Start:</span>
            <span className="font-bold">${currentPattern.data[0].price.toFixed(2)}</span>
          </motion.div> */}

          {/* <motion.div
            key={`current-${currentPatternIndex}-${data.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg"
          >
            <span className="text-muted-foreground mr-2">Current:</span>
            <span className="font-bold">${data[data.length - 1].price.toFixed(2)}</span>
          </motion.div> */}

          {/* <motion.div
            key={`increase-${currentPatternIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-green-600 dark:text-green-400 font-bold"
          >
            +{percentIncrease.toFixed(2)}%
          </motion.div> */}
        </div>
      )}
    </div>
  )
}

