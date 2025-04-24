"use client"

import { useEffect, useRef } from "react"

export function TreeBranch({ progress }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
      drawTree(ctx, progress)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    drawTree(ctx, progress)
  }, [progress])

  const drawTree = (ctx, progress) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Start position (bottom center of screen)
    const startX = ctx.canvas.width / 2
    const startY = ctx.canvas.height

    // Set line style
    ctx.lineWidth = 10
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Draw the main trunk
    drawBranch(
      ctx,
      startX,
      startY,
      -90, // Angle in degrees (upward)
      ctx.canvas.height * 0.4 * progress, // Length based on progress
      10 * progress, // Thickness based on progress
      progress,
      0, // Current depth
    )
  }

  const drawBranch = (
    ctx,
    startX,
    startY,
    angle,
    length,
    thickness,
    progress,
    depth,
  ) => {
    if (length < 10 || depth > 10) return

    // Calculate end point
    const endX = startX + length * Math.cos((angle * Math.PI) / 180)
    const endY = startY + length * Math.sin((angle * Math.PI) / 180)

    // Use solid black for the branch
    ctx.beginPath()
    ctx.strokeStyle = "rgb(0, 0, 0)"
    ctx.lineWidth = thickness
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()

    // Progress threshold for this depth
    const depthThreshold = 0.3 + depth * 0.07

    // Only draw sub-branches if we've scrolled enough
    if (progress > depthThreshold) {
      // Calculate sub-branch progress
      const subProgress = (progress - depthThreshold) / (1 - depthThreshold)

      // Draw right branch
      drawBranch(
        ctx,
        endX,
        endY,
        angle - 20 - Math.random() * 20,
        length * 0.75 * subProgress,
        thickness * 0.7,
        subProgress,
        depth + 1,
      )

      // Draw left branch
      drawBranch(
        ctx,
        endX,
        endY,
        angle + 20 + Math.random() * 20,
        length * 0.75 * subProgress,
        thickness * 0.7,
        subProgress,
        depth + 1,
      )

      // Sometimes add a middle branch
      if (Math.random() > 0.5 && depth < 3) {
        drawBranch(
          ctx,
          endX,
          endY,
          angle + (Math.random() - 0.5) * 10,
          length * 0.8 * subProgress,
          thickness * 0.7,
          subProgress,
          depth + 1,
        )
      }

      // Add leaves at the ends of branches
      if (depth > 2 && thickness < 3 && subProgress > 0.5) {
        drawLeaf(ctx, endX, endY, angle, subProgress)
      }
    }
  }

  const drawLeaf = (ctx, x, y, angle, progress) => {
    const leafSize = 5 + Math.random() * 5

    // Only draw if we're far enough along
    if (progress < 0.5) return

    // Use black for leaves with some transparency
    const alpha = 0.5 + Math.random() * 0.5
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * progress})`

    // Draw a simple oval leaf
    ctx.beginPath()
    ctx.ellipse(x, y, leafSize * progress, leafSize * 2 * progress, ((angle + 45) * Math.PI) / 180, 0, 2 * Math.PI)
    ctx.fill()
  }

  return <canvas ref={canvasRef} className="w-full h-full" />
}
