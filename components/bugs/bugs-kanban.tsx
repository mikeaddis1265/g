"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export function BugsKanban() {
  // This would be replaced with actual data from your backend
  const [columns, setColumns] = useState([
    {
      id: "open",
      title: "Open",
      bugs: [
        {
          id: "BUG-1001",
          title: "Login page crashes on mobile devices",
          priority: "High",
          severity: "Major",
          assignee: {
            name: "John Doe",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "JD",
          },
        },
        {
          id: "BUG-1003",
          title: "Navigation menu not displaying correctly on Firefox",
          priority: "Medium",
          severity: "Minor",
          assignee: {
            name: "Mike Johnson",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "MJ",
          },
        },
        {
          id: "BUG-1004",
          title: "API timeout when retrieving large datasets",
          priority: "High",
          severity: "Major",
          assignee: {
            name: "Emily Chen",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "EC",
          },
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      bugs: [
        {
          id: "BUG-1002",
          title: "Payment processing error on checkout",
          priority: "Critical",
          severity: "Critical",
          assignee: {
            name: "Sarah Kim",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "SK",
          },
        },
      ],
    },
    {
      id: "testing",
      title: "Testing",
      bugs: [],
    },
    {
      id: "resolved",
      title: "Resolved",
      bugs: [
        {
          id: "BUG-1005",
          title: "Product images not loading in search results",
          priority: "Medium",
          severity: "Minor",
          assignee: {
            name: "John Doe",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "JD",
          },
        },
      ],
    },
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2">
              {column.title}
              <Badge variant="secondary" className="rounded-full">
                {column.bugs.length}
              </Badge>
            </h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Column actions</span>
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {column.bugs.map((bug) => (
              <Card key={bug.id} className="shadow-sm">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm font-medium">
                    <Link href={`/bugs/${bug.id}`} className="hover:underline">
                      {bug.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span>
                      {bug.priority} / {bug.severity}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {bug.id}
                  </Badge>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={bug.assignee.avatar || "/placeholder.svg"} alt={bug.assignee.name} />
                    <AvatarFallback>{bug.assignee.initials}</AvatarFallback>
                  </Avatar>
                </CardFooter>
              </Card>
            ))}
            {column.bugs.length === 0 && (
              <div className="flex items-center justify-center h-24 border border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">No bugs</p>
              </div>
            )}
            <Button variant="ghost" className="justify-start text-sm text-muted-foreground">
              + Add bug
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
