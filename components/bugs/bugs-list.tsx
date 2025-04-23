import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Clock, MoreHorizontal, Tag } from "lucide-react"
import Link from "next/link"

export function BugsList() {
  const bugs = [
    {
      id: "BUG-1001",
      title: "Login page crashes on mobile devices",
      description: "When attempting to login on mobile devices, the page crashes after submitting credentials.",
      status: "Open",
      priority: "High",
      severity: "Major",
      project: "E-commerce Platform",
      assignee: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      created: "2 days ago",
      updated: "4 hours ago",
      tags: ["mobile", "authentication", "crash"],
    },
    {
      id: "BUG-1002",
      title: "Payment processing error on checkout",
      description: "Users receive an error when attempting to complete payment during checkout process.",
      status: "In Progress",
      priority: "Critical",
      severity: "Critical",
      project: "E-commerce Platform",
      assignee: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SK",
      },
      created: "3 days ago",
      updated: "1 day ago",
      tags: ["payment", "checkout", "error"],
    },
    {
      id: "BUG-1003",
      title: "Navigation menu not displaying correctly on Firefox",
      description: "The dropdown navigation menu is not displaying correctly when using Firefox browser.",
      status: "Open",
      priority: "Medium",
      severity: "Minor",
      project: "Admin Dashboard",
      assignee: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
      created: "1 week ago",
      updated: "2 days ago",
      tags: ["ui", "firefox", "navigation"],
    },
    {
      id: "BUG-1004",
      title: "API timeout when retrieving large datasets",
      description: "The API times out when attempting to retrieve datasets with more than 1000 records.",
      status: "Open",
      priority: "High",
      severity: "Major",
      project: "API Gateway",
      assignee: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EC",
      },
      created: "5 days ago",
      updated: "3 days ago",
      tags: ["api", "performance", "timeout"],
    },
    {
      id: "BUG-1005",
      title: "Product images not loading in search results",
      description: "Product images fail to load when viewing search results on the product listing page.",
      status: "Resolved",
      priority: "Medium",
      severity: "Minor",
      project: "E-commerce Platform",
      assignee: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      created: "1 week ago",
      updated: "1 day ago",
      tags: ["images", "search", "ui"],
    },
  ]

  return (
    <div className="space-y-4">
      {bugs.map((bug) => (
        <Card key={bug.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">
                    <Link href={`/bugs/${bug.id}`} className="hover:underline">
                      {bug.title}
                    </Link>
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {bug.id}
                  </Badge>
                </div>
                <CardDescription className="mt-1 line-clamp-2">{bug.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View details</DropdownMenuItem>
                  <DropdownMenuItem>Edit bug</DropdownMenuItem>
                  <DropdownMenuItem>Change status</DropdownMenuItem>
                  <DropdownMenuItem>Reassign</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete bug</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {bug.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>
                  {bug.priority} / {bug.severity}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                <span>{bug.project}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Updated {bug.updated}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  bug.status === "Open"
                    ? "destructive"
                    : bug.status === "In Progress"
                      ? "default"
                      : bug.status === "Resolved"
                        ? "success"
                        : "secondary"
                }
                className="text-xs"
              >
                {bug.status}
              </Badge>
              <Avatar className="h-6 w-6">
                <AvatarImage src={bug.assignee.avatar || "/placeholder.svg"} alt={bug.assignee.name} />
                <AvatarFallback>{bug.assignee.initials}</AvatarFallback>
              </Avatar>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
