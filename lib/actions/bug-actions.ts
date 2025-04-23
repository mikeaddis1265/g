"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { type BugPriority, type BugSeverity, BugStatus } from "@prisma/client"

type CreateBugInput = {
  title: string
  description: string
  steps_to_reproduce?: string
  project_id: string
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  severity: "CRITICAL" | "MAJOR" | "MINOR" | "TRIVIAL"
  assignee_id?: string | null
  tags?: string[]
}

export async function createBug(input: CreateBugInput) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    if (!input.title || !input.description || !input.project_id) {
      return { error: "Title, description, and project are required" }
    }

    // Create the bug
    const bug = await prisma.bug.create({
      data: {
        title: input.title,
        description: input.description,
        stepsToReproduce: input.steps_to_reproduce || null,
        projectId: input.project_id,
        status: BugStatus.OPEN,
        priority: input.priority as BugPriority,
        severity: input.severity as BugSeverity,
        reporterId: session.user.id,
        assigneeId: input.assignee_id || null,
        tags: input.tags || [],
      },
    })

    // Record the activity
    await prisma.bugActivity.create({
      data: {
        bugId: bug.id,
        userId: session.user.id,
        action: "created",
        details: "this bug",
      },
    })

    revalidatePath("/bugs")
    revalidatePath(`/projects/${input.project_id}`)

    return { bug }
  } catch (error: any) {
    console.error("Error creating bug:", error)
    return { error: error.message || "Failed to create bug" }
  }
}

type UpdateBugInput = {
  id: string
  title?: string
  description?: string
  steps_to_reproduce?: string
  status?: "OPEN" | "IN_PROGRESS" | "TESTING" | "RESOLVED" | "CLOSED"
  priority?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  severity?: "CRITICAL" | "MAJOR" | "MINOR" | "TRIVIAL"
  assignee_id?: string | null
  tags?: string[]
}

export async function updateBug(input: UpdateBugInput) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    const { id, ...updates } = input

    // Get the current bug state for comparison
    const currentBug = await prisma.bug.findUnique({
      where: { id },
    })

    if (!currentBug) {
      return { error: "Bug not found" }
    }

    // Update the bug
    const bug = await prisma.bug.update({
      where: { id },
      data: {
        title: updates.title,
        description: updates.description,
        stepsToReproduce: updates.steps_to_reproduce,
        status: updates.status as BugStatus | undefined,
        priority: updates.priority as BugPriority | undefined,
        severity: updates.severity as BugSeverity | undefined,
        assigneeId: updates.assignee_id,
        tags: updates.tags,
      },
    })

    // Record activities for each changed field
    const activities = []

    if (updates.status && currentBug.status !== updates.status) {
      activities.push({
        bugId: id,
        userId: session.user.id,
        action: "changed status",
        details: `from ${currentBug.status} to ${updates.status}`,
      })
    }

    if (updates.assignee_id !== undefined && currentBug.assigneeId !== updates.assignee_id) {
      let details = "to unassigned"

      if (updates.assignee_id) {
        // Get the assignee name
        const assignee = await prisma.user.findUnique({
          where: { id: updates.assignee_id },
          select: { firstName: true, lastName: true },
        })

        if (assignee) {
          details = `to ${assignee.firstName} ${assignee.lastName}`
        }
      }

      activities.push({
        bugId: id,
        userId: session.user.id,
        action: "assigned bug",
        details,
      })
    }

    if (updates.priority && currentBug.priority !== updates.priority) {
      activities.push({
        bugId: id,
        userId: session.user.id,
        action: "updated priority",
        details: `to ${updates.priority}`,
      })
    }

    if (updates.severity && currentBug.severity !== updates.severity) {
      activities.push({
        bugId: id,
        userId: session.user.id,
        action: "updated severity",
        details: `to ${updates.severity}`,
      })
    }

    if (activities.length > 0) {
      await prisma.bugActivity.createMany({
        data: activities,
      })
    }

    revalidatePath(`/bugs/${id}`)
    revalidatePath("/bugs")
    revalidatePath(`/projects/${bug.projectId}`)

    return { bug }
  } catch (error: any) {
    console.error("Error updating bug:", error)
    return { error: error.message || "Failed to update bug" }
  }
}

export async function addComment(bugId: string, content: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    if (!content) {
      return { error: "Comment content is required" }
    }

    // Create the comment
    const comment = await prisma.bugComment.create({
      data: {
        bugId,
        userId: session.user.id,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Record the activity
    await prisma.bugActivity.create({
      data: {
        bugId,
        userId: session.user.id,
        action: "added comment",
        details: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
      },
    })

    revalidatePath(`/bugs/${bugId}`)

    return { comment }
  } catch (error: any) {
    console.error("Error adding comment:", error)
    return { error: error.message || "Failed to add comment" }
  }
}
