import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("rounded-md border", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("w-full", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("flex justify-center pt-4", className)} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("rounded-md border bg-popover p-4 text-popover-foreground shadow-md", className)}
        ref={ref}
        {...props}
      />
    )
  },
)
ChartTooltip.displayName = "ChartTooltip"

export { Chart, ChartContainer, ChartLegend, ChartTooltip }
