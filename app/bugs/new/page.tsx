"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, PaperclipIcon, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { createBug } from "@/lib/actions/bug-actions"

export default function NewBugPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stepsToReproduce: "",
    projectId: "",
    priority: "medium",
    severity: "minor",
    assigneeId: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createBug({
        title: formData.title,
        description: formData.description,
        steps_to_reproduce: formData.stepsToReproduce,
        project_id: formData.projectId,
        priority: formData.priority as "critical" | "high" | "medium" | "low",
        severity: formData.severity as "critical" | "major" | "minor" | "trivial",
        assignee_id: formData.assigneeId || null,
        tags,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Bug created",
        description: "Your bug has been reported successfully",
      })

      router.push(`/bugs/${result.bug.id}`)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create bug. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-xl font-bold">Report a Bug</h1>
          <p className="text-sm text-muted-foreground">Create a new bug report</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Bug Information</CardTitle>
                <CardDescription>
                  Provide detailed information about the bug to help developers understand and fix the issue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Brief description of the bug"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed description of the bug"
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
                  <Textarea
                    id="stepsToReproduce"
                    name="stepsToReproduce"
                    placeholder="1. Go to...\n2. Click on...\n3. Observe..."
                    className="min-h-[100px]"
                    value={formData.stepsToReproduce}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 rounded-full hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tag} tag</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="tagInput"
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add tag</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline">
                      <PaperclipIcon className="mr-2 h-4 w-4" />
                      Add Attachment
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can upload screenshots, logs, or any other relevant files.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project & Classification</CardTitle>
                <CardDescription>Select the project and classify the bug.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select value={formData.projectId} onValueChange={(value) => handleSelectChange("projectId", value)}>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-1">E-commerce Platform</SelectItem>
                      <SelectItem value="project-2">Mobile App</SelectItem>
                      <SelectItem value="project-3">Admin Dashboard</SelectItem>
                      <SelectItem value="project-4">API Gateway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                    <SelectTrigger id="priority">
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
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={formData.severity} onValueChange={(value) => handleSelectChange("severity", value)}>
                    <SelectTrigger id="severity">
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
                <CardDescription>Assign the bug to a team member or leave it unassigned.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select
                    value={formData.assigneeId}
                    onValueChange={(value) => handleSelectChange("assigneeId", value)}
                  >
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="user-1">John Doe</SelectItem>
                      <SelectItem value="user-2">Sarah Kim</SelectItem>
                      <SelectItem value="user-3">Mike Johnson</SelectItem>
                      <SelectItem value="user-4">Emily Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Bug Report"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
