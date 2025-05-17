import * as React from "react"
import { cn } from "../lib/utils.ts"

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  ...props
}) {
  return (
    <div className={cn("rounded-xl border bg-white p-6 shadow-sm", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      {(description || trend) && (
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          {description && <p>{description}</p>}
          {trend && (
            <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
              {trend.isPositive ? "+" : "-"}
              {trend.value}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
