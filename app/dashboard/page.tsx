import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowUpRight, Bug, CheckCircle, Clock, Folder, Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import { BugPriorityChart } from "@/components/dashboard/bug-priority-chart"
import { BugStatusChart } from "@/components/dashboard/bug-status-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your projects and bug tracking metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Bugs</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">-3 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85</div>
              <p className="text-xs text-muted-foreground">+8 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Bug Status Distribution</CardTitle>
                  <CardDescription>Distribution of bugs by their current status</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <BugStatusChart />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Bug Priority</CardTitle>
                  <CardDescription>Distribution of bugs by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                  <BugPriorityChart />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your most recently updated projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "E-commerce Platform", bugs: 24, open: 8 },
                      { name: "Mobile App", bugs: 18, open: 5 },
                      { name: "Admin Dashboard", bugs: 32, open: 12 },
                      { name: "API Gateway", bugs: 15, open: 3 },
                    ].map((project) => (
                      <div key={project.name} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{project.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.bugs} bugs ({project.open} open)
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/projects/${project.name.toLowerCase().replace(/\s+/g, "-")}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions across your projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivity />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bug Resolution Time</CardTitle>
                <CardDescription>Average time to resolve bugs by priority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Resolution time chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Recent activity across all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">John Doe</span>{" "}
                          {["resolved a bug", "assigned a bug", "created a new project", "commented on a bug"][i % 4]}{" "}
                          <span className="font-medium">
                            {
                              [
                                "Login page crash",
                                "Payment processing error",
                                "Navigation menu bug",
                                "API timeout issue",
                              ][i % 4]
                            }
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {["2 hours ago", "4 hours ago", "Yesterday at 4:30 PM", "2 days ago"][i % 4]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
