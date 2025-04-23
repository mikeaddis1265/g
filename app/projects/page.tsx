import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Clock, MoreHorizontal, Plus, Search, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function ProjectsPage() {
  const projects = [
    {
      id: "ecommerce",
      name: "E-commerce Platform",
      description: "Online shopping platform with product catalog and checkout system",
      bugs: {
        total: 42,
        open: 8,
        inProgress: 12,
        resolved: 22,
      },
      members: 8,
      progress: 65,
      lastUpdated: "2 hours ago",
      team: [
        { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
        { name: "Sarah Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "SK" },
        { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "MJ" },
      ],
    },
    {
      id: "mobile",
      name: "Mobile App",
      description: "Cross-platform mobile application for iOS and Android",
      bugs: {
        total: 28,
        open: 5,
        inProgress: 8,
        resolved: 15,
      },
      members: 5,
      progress: 72,
      lastUpdated: "1 day ago",
      team: [
        { name: "Emily Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "EC" },
        { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      ],
    },
    {
      id: "admin",
      name: "Admin Dashboard",
      description: "Internal administration dashboard for content management",
      bugs: {
        total: 32,
        open: 12,
        inProgress: 5,
        resolved: 15,
      },
      members: 4,
      progress: 48,
      lastUpdated: "3 days ago",
      team: [
        { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "MJ" },
        { name: "Sarah Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "SK" },
      ],
    },
    {
      id: "api",
      name: "API Gateway",
      description: "RESTful API gateway for microservices architecture",
      bugs: {
        total: 15,
        open: 3,
        inProgress: 2,
        resolved: 10,
      },
      members: 3,
      progress: 85,
      lastUpdated: "5 days ago",
      team: [{ name: "Emily Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "EC" }],
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage your development projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search projects..." className="pl-8 w-full md:max-w-sm" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>
                      <Link href={`/projects/${project.id}`} className="hover:underline">
                        {project.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1">{project.description}</CardDescription>
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
                      <DropdownMenuItem>View project</DropdownMenuItem>
                      <DropdownMenuItem>Edit project</DropdownMenuItem>
                      <DropdownMenuItem>Project settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold">{project.bugs.total}</span>
                    <span className="text-xs text-muted-foreground">Total Bugs</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold">{project.bugs.open}</span>
                    <span className="text-xs text-muted-foreground">Open</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold">{project.bugs.resolved}</span>
                    <span className="text-xs text-muted-foreground">Resolved</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{project.members} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Updated {project.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {project.team.map((member, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members > project.team.length && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                      +{project.members - project.team.length}
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
