import * as React from "react"
import { cn } from "../lib/utils.ts"

export function SectionHeader({ title, description, action, className, ...props }) {
  return (
    <div className={cn("flex flex-col items-start justify-between gap-2 md:flex-row md:items-center", className)} {...props}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {action ? <div className="mt-2 md:mt-0">{action}</div> : null}
    </div>
  )
}
