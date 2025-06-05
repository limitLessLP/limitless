import * as React from "react"
import { cn } from "../lib/utils.ts"

export function Card({ className, ...props }) {
  return <div className={cn("rounded-xl border bg-white text-black shadow", className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-2xl font-semibold", className)} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}
