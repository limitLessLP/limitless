"use client"

import React from "react"
import { useMemo } from "react"

interface BranchProps {
  x: number
  y: number
  angle: number
  length: number
  depth: number
  maxDepth: number
  direction: number
  thickness: number
  tangentX: number
  tangentY: number
  normalX: number
  normalY: number
  isVisible: boolean
  scrollDirection: "up" | "down"
  stepIndex: number
  currentStep: number
}

export function Branch({
  x,
  y,
  angle,
  length,
  depth,
  maxDepth,
  direction,
  thickness,
  tangentX,
  tangentY,
  normalX,
  normalY,
  isVisible,
  scrollDirection,
  stepIndex,
  currentStep,
}: BranchProps) {
  // Pre-calculate all branch paths and sub-branches
  const { branchPath, subBranches } = useMemo(() => {
    // Calculate end point of this branch
    const radians = (angle * Math.PI) / 180
    const endX = x + Math.cos(radians) * length
    const endY = y + Math.sin(radians) * length

    // Create a curved branch that follows the direction of the main vine
    const controlPointX = x + (endX - x) * 0.5 + normalX * (Math.random() * 10)
    const controlPointY = y + (endY - y) * 0.5 + normalY * (Math.random() * 10)

    const path = `M${x},${y} Q${controlPointX},${controlPointY} ${endX},${endY}`

    // Generate sub-branches
    const subs: { key: string; props: BranchProps }[] = []
    if (depth < maxDepth) {
      const branchCount = Math.max(1, 3 - depth)

      for (let i = 0; i < branchCount; i++) {
        // Create sub-branches with varying angles
        const subAngle = angle + direction * (20 + Math.random() * 20)
        const subLength = length * (0.5 + Math.random() * 0.3)
        const position = 0.3 + (i / branchCount) * 0.7

        // Calculate position along the branch
        const subX = x + (endX - x) * position
        const subY = y + (endY - y) * position

        subs.push({
          key: `${depth}-${i}`,
          props: {
            x: subX,
            y: subY,
            angle: subAngle,
            length: subLength,
            depth: depth + 1,
            maxDepth,
            direction: direction * (Math.random() > 0.3 ? 1 : -1),
            thickness: thickness * 0.7,
            tangentX,
            tangentY,
            normalX,
            normalY,
            stepIndex,
            currentStep,
            isVisible,
            scrollDirection,
          },
        })
      }
    }

    return { branchPath: path, subBranches: subs }
  }, [x, y, angle, length, depth, maxDepth, direction, thickness, normalX, normalY, tangentX, tangentY, stepIndex])

  // Calculate visibility delay based on depth
  const delay = depth * 150

  // Determine transition style based on scroll direction
  const transitionStyle =
    scrollDirection === "down"
      ? `opacity 0.3s ease-out ${delay}ms, transform 0.4s ease-out ${delay}ms`
      : `opacity 0.2s ease-in, transform 0.3s ease-in`

  // Calculate transform origin
  const transformOrigin = `${x}px ${y}px`

  if (depth > maxDepth) return null

  return (
    <>
      <path
        d={branchPath}
        fill="none"
        stroke="url(#branchGradient)"
        strokeWidth={thickness}
        strokeLinecap="round"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.1)",
          transformOrigin,
          transition: transitionStyle,
        }}
      />

      {subBranches.map((sub) => (
        <Branch key={sub.key} {...sub.props} isVisible={isVisible} scrollDirection={scrollDirection} />
      ))}
    </>
  )
}
