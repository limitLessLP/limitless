import * as React from "react"
import { cn } from "../lib/utils.ts"

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-transparent bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800",
        className
      )}
      {...props}
    />
  )
}
