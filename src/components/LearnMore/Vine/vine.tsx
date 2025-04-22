"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Branch } from "./branch.tsx"
import React from "react"

interface VineProps {
  scrollPosition: number
  scrollDirection: "up" | "down"
  maxScroll: number
  steps: number
}

interface Point {
  x: number
  y: number
}

interface BranchPoint {
  x: number
  y: number
  direction: number
  angle: number
  tangentX: number
  tangentY: number
  normalX: number
  normalY: number
  stepIndex: number
}

export function Vine({ scrollPosition, scrollDirection, maxScroll, steps }: VineProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Calculate how much of the vine to show based on scroll position
  const growthPercentage = Math.min(1, scrollPosition / maxScroll)
  const vineHeight = dimensions.height * 3 * growthPercentage

  // Calculate current step based on scroll position
  const currentStep = Math.min(steps, Math.floor((scrollPosition / maxScroll) * steps) + 1)

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Pre-calculate the entire vine path - this only recalculates when dimensions change
  const { vinePath, vinePoints } = useMemo(() => {
    if (dimensions.width === 0) return { vinePath: "", vinePoints: [] }

    const points: Point[] = []
    const segments = 100
    const centerX = dimensions.width / 2
    const amplitude = dimensions.width * 0.2 // How far the vine curves
    const totalHeight = dimensions.height * 3

    for (let i = 0; i <= segments; i++) {
      const progress = i / segments
      const y = progress * totalHeight

      // Create a sine wave that alternates from right to left
      const x = centerX + Math.sin(progress * Math.PI * steps) * amplitude

      points.push({ x, y })
    }

    // Create the SVG path
    const pathCommands = points.map((point, i) => {
      return i === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`
    })

    return {
      vinePath: pathCommands.join(" "),
      vinePoints: points,
    }
  }, [dimensions, steps])

  // Pre-calculate all possible branch points - this only recalculates when vinePoints change
  const allBranchPoints = useMemo(() => {
    if (vinePoints.length === 0) return []

    const points: BranchPoint[] = []
    const stepHeight = (dimensions.height * 3) / steps

    // Generate branch points for all steps
    for (let step = 0; step < steps; step++) {
      const baseY = step * stepHeight + stepHeight * 0.5

      // Find points on the vine near this step
      const vinePointsForStep = vinePoints.filter(
        (p) => p.y >= baseY - stepHeight * 0.2 && p.y <= baseY + stepHeight * 0.2,
      )

      if (vinePointsForStep.length === 0) continue

      // Sample a few points for branches
      const sampleCount = 3 // 3 branches per step
      const sampledPoints: Point[] = []

      for (let i = 0; i < sampleCount; i++) {
        const randomIndex = Math.floor(Math.random() * vinePointsForStep.length)
        sampledPoints.push(vinePointsForStep[randomIndex])
      }

      // For each sampled point, calculate branch parameters
      for (const vinePoint of sampledPoints) {
        // Find nearby points to calculate tangent
        const pointIndex = vinePoints.findIndex((p) => p.x === vinePoint.x && p.y === vinePoint.y)
        const nextPointIndex = Math.min(pointIndex + 5, vinePoints.length - 1)
        const prevPointIndex = Math.max(pointIndex - 5, 0)

        const nextPoint = vinePoints[nextPointIndex]
        const prevPoint = vinePoints[prevPointIndex]

        // Calculate tangent direction
        let tangentX = nextPoint.x - prevPoint.x
        let tangentY = nextPoint.y - prevPoint.y

        // Normalize the tangent
        const length = Math.sqrt(tangentX * tangentX + tangentY * tangentY)
        tangentX = tangentX / length
        tangentY = tangentY / length

        // Calculate perpendicular direction (normal)
        const direction = step % 2 === 0 ? -1 : 1
        const normalX = -tangentY * direction
        const normalY = tangentX * direction

        // Calculate angle based on the normal
        const angle = Math.atan2(normalY, normalX) * (180 / Math.PI)

        points.push({
          x: vinePoint.x,
          y: vinePoint.y,
          direction,
          angle,
          tangentX,
          tangentY,
          normalX,
          normalY,
          stepIndex: step,
        })
      }
    }

    return points
  }, [vinePoints, dimensions.height, steps])

  // Filter branch points based on current scroll position
  const visibleBranchPoints = useMemo(() => {
    return allBranchPoints.filter((point) => point.stepIndex < currentStep && point.y <= vineHeight)
  }, [allBranchPoints, currentStep, vineHeight])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      className="overflow-visible"
      style={{
        filter: "drop-shadow(0 0 10px rgba(0, 100, 0, 0.2))",
      }}
    >
      {/* Main vine */}
      <path
        d={vinePath}
        fill="none"
        stroke="url(#vineGradient)"
        strokeWidth={8}
        strokeLinecap="round"
        style={{
          strokeDasharray: dimensions.height * 3,
          strokeDashoffset: dimensions.height * 3 - vineHeight,
          transition: scrollDirection === "down" ? "stroke-dashoffset 0.3s ease-out" : "stroke-dashoffset 0.3s ease-in",
        }}
      />

      {/* All possible branches - visibility controlled by CSS */}
      {allBranchPoints.map((point, index) => (
        <Branch
          key={index}
          x={point.x}
          y={point.y}
          angle={point.angle}
          length={60 + Math.random() * 40}
          depth={0}
          maxDepth={4}
          direction={point.direction}
          thickness={6}
          tangentX={point.tangentX}
          tangentY={point.tangentY}
          normalX={point.normalX}
          normalY={point.normalY}
          isVisible={point.stepIndex < currentStep && point.y <= vineHeight}
          scrollDirection={scrollDirection}
          stepIndex={point.stepIndex}
          currentStep={currentStep}
        />
      ))}

      {/* Gradient for the vine */}
      <defs>
        <linearGradient id="vineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2e7d32" />
          <stop offset="50%" stopColor="#1b5e20" />
          <stop offset="100%" stopColor="#1b5e20" />
        </linearGradient>
        <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1b5e20" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>
      </defs>
    </svg>
  )
}
