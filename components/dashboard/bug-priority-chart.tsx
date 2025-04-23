"use client"

import { Chart, ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Critical", value: 12, color: "#ef4444" },
  { name: "High", value: 24, color: "#f97316" },
  { name: "Medium", value: 45, color: "#eab308" },
  { name: "Low", value: 46, color: "#22c55e" },
]

export function BugPriorityChart() {
  return (
    <ChartContainer>
      <Chart className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltip>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                          <div className="font-medium">{payload[0].name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Count:</span>
                          <span className="font-bold">{payload[0].value}</span>
                        </div>
                      </div>
                    </ChartTooltip>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Chart>
      <ChartLegend>
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium">{item.name}</span>
          </div>
        ))}
      </ChartLegend>
    </ChartContainer>
  )
}
