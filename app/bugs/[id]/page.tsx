"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  ArrowLeft,
  Bug,
  Calendar,
  Clock,
  Edit,
  FileText,
  Folder,
  Loader2,
  PaperclipIcon,
  Send,
  User,
} from "lucide-react"
import Link from "next/link"
import { BugComments } from "@/components/bugs/bug-comments"
import { BugActivity } from "@/components/bugs/bug-activity"
import { useToast } from "@/hooks/use-toast"
import { updateBug, addComment } from "@/lib/actions/bug-actions"

export default function BugDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const bugId = params.id
  const [bug, setBug] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [attachments, setAttachments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [bugUpdates, setBugUpdates] = useState({
    status: "",
    priority: "",
    severity: "",
    assignee_id: "",
  })

  useEffect(() => {
    const fetchBugDetails = async () => {
      try {
        const response = await fetch(`/api/bugs/${bugId}`)
        const data = await response.json()

        if (response.ok) {
          setBug(data.bug)
          setComments(data.comments || [])
          setActivity(data.activity || [])
          setAttachments(data.attachments || [])

          setBugUpdates({
            status: data.bug.status,
            priority: data.bug.priority,
            severity: data.bug.severity,
            assignee_id: data.bug.assignee_id || "",
          })
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to fetch bug details",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBugDetails()
  }, [bugId, toast])

  const handleUpdateBug = async () => {
    setIsUpdating(true)

    try {
      const result = await updateBug({
        id: bugId,
        status: bugUpdates.status as any,
        priority: bugUpdates.priority as any,
        severity: bugUpdates.severity as any,
        assignee_id: bugUpdates.assignee_id || null,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Bug updated",
        description: "The bug has been updated successfully",
      })

      // Update local state
      setBug((prev: any) => ({
        ...prev,
        ...result.bug,
      }))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update bug. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) return

    setIsAddingComment(true)

    try {
      const result = await addComment(bugId, commentText)

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      })

      // Update local state
      setComments((prev) => [...prev, result.comment])
      setCommentText("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingComment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!bug) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Bug not found</h2>
          <p className="text-muted-foreground">
            The bug you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button asChild className="mt-4">
            <Link href="/bugs">Back to Bugs</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b px-6 py-4">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/bugs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bugs
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{bug.title}</h1>
            <Badge variant="outline">{bug.id}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>in</span>
            <Link href={`/projects/${bug.projects?.id || "#"}`} className="hover:underline">
              {bug.projects?.name || "Unknown Project"}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Bug Details</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{bug.description}</p>
                </div>
                {bug.steps_to_reproduce && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Steps to Reproduce</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{bug.steps_to_reproduce}</p>
                  </div>
                )}
                {attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Attachments</h3>
                    <div className="grid gap-2">
                      {attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded-md">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{attachment.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round(attachment.file_size / 1024)} KB
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                              Download
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {bug.tags && bug.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {bug.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="comments" className="space-y-4">
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="comments" className="space-y-4">
                <BugComments comments={comments} />
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleAddComment} className="space-y-4">
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[100px]"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={isAddingComment}
                      />
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" type="button" disabled={isAddingComment}>
                          <PaperclipIcon className="mr-2 h-4 w-4" />
                          Attach
                        </Button>
                        <Button size="sm" type="submit" disabled={isAddingComment || !commentText.trim()}>
                          {isAddingComment ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Posting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Comment
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity">
                <Card>
                  <CardContent className="pt-6">
                    <BugActivity activities={activity} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Status</label>
                  <Select
                    value={bugUpdates.status}
                    onValueChange={(value) => setBugUpdates((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={bugUpdates.priority}
                    onValueChange={(value) => setBugUpdates((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity</label>
                  <Select
                    value={bugUpdates.severity}
                    onValueChange={(value) => setBugUpdates((prev) => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="trivial">Trivial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignee</label>
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    {bug.assignee ? (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={bug.assignee.avatar_url || "/placeholder.svg"}
                            alt={`${bug.assignee.first_name} ${bug.assignee.last_name}`}
                          />
                          <AvatarFallback>{`${bug.assignee.first_name?.[0] || ""}${bug.assignee.last_name?.[0] || ""}`}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{`${bug.assignee.first_name || ""} ${bug.assignee.last_name || ""}`}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                    <Button variant="ghost" size="sm" className="ml-auto h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Change assignee</span>
                    </Button>
                  </div>
                </div>
                <Button className="w-full" onClick={handleUpdateBug} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-3 items-start">
                  <Bug className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Bug ID</p>
                    <p className="text-sm text-muted-foreground">{bug.id}</p>
                  </div>

                  <User className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Reporter</p>
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={bug.reporter?.avatar_url || "/placeholder.svg"}
                          alt={`${bug.reporter?.first_name || ""} ${bug.reporter?.last_name || ""}`}
                        />
                        <AvatarFallback>{`${bug.reporter?.first_name?.[0] || ""}${bug.reporter?.last_name?.[0] || ""}`}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-muted-foreground">{`${bug.reporter?.first_name || ""} ${bug.reporter?.last_name || ""}`}</p>
                    </div>
                  </div>

                  <Folder className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Project</p>
                    <p className="text-sm text-muted-foreground">{bug.projects?.name || "Unknown Project"}</p>
                  </div>

                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">{new Date(bug.created_at).toLocaleDateString()}</p>
                  </div>

                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Updated</p>
                    <p className="text-sm text-muted-foreground">{new Date(bug.updated_at).toLocaleDateString()}</p>
                  </div>

                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Priority / Severity</p>
                    <p className="text-sm text-muted-foreground">
                      {bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)} /{" "}
                      {bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
