import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Bug, CheckCircle, Clock, Users, Folder } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Welcome to BugTracker</h1>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Track, Manage, and Resolve Software Bugs Efficiently
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A comprehensive bug tracking system for development teams of all sizes. Streamline your workflow and
                  improve software quality.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/demo">View Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bug Tracking</CardTitle>
                  <Bug className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Comprehensive</div>
                  <p className="text-xs text-muted-foreground">
                    Track bugs with detailed information, attachments, and history
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Project Management</CardTitle>
                  <Folder className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Organized</div>
                  <p className="text-xs text-muted-foreground">Manage multiple projects with customizable workflows</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Collaboration</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Collaborative</div>
                  <p className="text-xs text-muted-foreground">
                    Work together with role-based permissions and notifications
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Real-time Updates</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Instant</div>
                  <p className="text-xs text-muted-foreground">Get real-time notifications and activity logs</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Everything you need to manage your software development process
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:col-span-2 xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Bug Reporting</CardTitle>
                    <CardDescription>Submit detailed bug reports with attachments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Detailed bug descriptions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Steps to reproduce</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Screenshot attachments</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Severity and priority settings</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Bug Tracking</CardTitle>
                    <CardDescription>Track and manage bugs through their lifecycle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Kanban board view</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>List and table views</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Advanced filtering and sorting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Status and assignment management</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Project Management</CardTitle>
                    <CardDescription>Organize bugs by projects and teams</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Multiple project support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Team assignment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Project dashboards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Customizable workflows</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Reporting & Analytics</CardTitle>
                    <CardDescription>Gain insights with powerful reporting tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Bug trend analysis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Developer performance metrics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Project health indicators</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Customizable reports</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 BugTracker. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
