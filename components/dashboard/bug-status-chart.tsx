"use client"
import { Chart, ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  {
    name: "Open",
    value: 42,
    fill: "#f97316",
  },
  {
    name: "In Progress",
    value: 28,
    fill: "#3b82f6",
  },
  {
    name: "Testing",
    value: 15,
    fill: "#a855f7",
  },
  {
    name: "Resolved",
    value: 32,
    fill: "#22c55e",
  },
  {
    name: "Closed",
    value: 10,
    fill: "#64748b",
  },
]

export function BugStatusChart() {
  return (
    <ChartContainer>
      <Chart className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltip>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
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
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Chart>
      <ChartLegend>
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-xs font-medium">{item.name}</span>
          </div>
        ))}
      </ChartLegend>
    </ChartContainer>
  )
}
