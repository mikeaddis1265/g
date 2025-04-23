import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { BugsList } from "@/components/bugs/bugs-list"
import { BugsKanban } from "@/components/bugs/bugs-kanban"

export default function BugsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Bugs</h1>
          <p className="text-sm text-muted-foreground">Track and manage all reported bugs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Report Bug
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search bugs..." className="pl-8 w-full md:max-w-sm" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Status</DropdownMenuItem>
                <DropdownMenuItem>Priority</DropdownMenuItem>
                <DropdownMenuItem>Assignee</DropdownMenuItem>
                <DropdownMenuItem>Project</DropdownMenuItem>
                <DropdownMenuItem>Date Created</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Advanced
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="ecommerce">E-commerce Platform</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
                <SelectItem value="admin">Admin Dashboard</SelectItem>
                <SelectItem value="api">API Gateway</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <TabsContent value="list" className="space-y-4">
            <BugsList />
          </TabsContent>
          <TabsContent value="kanban">
            <BugsKanban />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
