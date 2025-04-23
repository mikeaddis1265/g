"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"

type CreateBugInput = {
  title: string
  description: string
  steps_to_reproduce?: string
  project_id: string
  priority: "critical" | "high" | "medium" | "low"
  severity: "critical" | "major" | "minor" | "trivial"
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
    const { data: bug, error: bugError } = await supabase
      .from("bugs")
      .insert({
        title: input.title,
        description: input.description,
        steps_to_reproduce: input.steps_to_reproduce || null,
        project_id: input.project_id,
        status: "open",
        priority: input.priority,
        severity: input.severity,
        reporter_id: session.user.id,
        assignee_id: input.assignee_id || null,
        tags: input.tags || [],
      })
      .select()
      .single()

    if (bugError) {
      throw bugError
    }

    // Record the activity
    const { error: activityError } = await supabase.from("bug_activity").insert({
      bug_id: bug.id,
      user_id: session.user.id,
      action: "created",
      details: "this bug",
    })

    if (activityError) {
      throw activityError
    }

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
  status?: "open" | "in_progress" | "testing" | "resolved" | "closed"
  priority?: "critical" | "high" | "medium" | "low"
  severity?: "critical" | "major" | "minor" | "trivial"
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
    const { data: currentBug, error: currentBugError } = await supabase.from("bugs").select("*").eq("id", id).single()

    if (currentBugError) {
      throw currentBugError
    }

    // Update the bug
    const { data: bug, error: updateError } = await supabase
      .from("bugs")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Record activities for each changed field
    const activities = []

    for (const [key, value] of Object.entries(updates)) {
      if (currentBug[key] !== value) {
        let action = `updated ${key.replace("_", " ")}`
        let details = `to ${value}`

        if (key === "status") {
          action = "changed status"
          details = `from ${currentBug.status} to ${value}`
        } else if (key === "assignee_id") {
          action = "assigned bug"

          if (!value) {
            details = "to unassigned"
          } else {
            // Get the assignee name
            const { data: assignee } = await supabase
              .from("users")
              .select("first_name, last_name")
              .eq("id", value)
              .single()

            details = `to ${assignee.first_name} ${assignee.last_name}`
          }
        }

        activities.push({
          bug_id: id,
          user_id: session.user.id,
          action,
          details,
        })
      }
    }

    if (activities.length > 0) {
      const { error: activityError } = await supabase.from("bug_activity").insert(activities)

      if (activityError) {
        throw activityError
      }
    }

    revalidatePath(`/bugs/${id}`)
    revalidatePath("/bugs")
    revalidatePath(`/projects/${bug.project_id}`)

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
    const { data: comment, error: commentError } = await supabase
      .from("bug_comments")
      .insert({
        bug_id: bugId,
        user_id: session.user.id,
        content,
      })
      .select(`
        *,
        users(id, first_name, last_name, avatar_url)
      `)
      .single()

    if (commentError) {
      throw commentError
    }

    // Record the activity
    const { error: activityError } = await supabase.from("bug_activity").insert({
      bug_id: bugId,
      user_id: session.user.id,
      action: "added comment",
      details: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
    })

    if (activityError) {
      throw activityError
    }

    revalidatePath(`/bugs/${bugId}`)

    return { comment }
  } catch (error: any) {
    console.error("Error adding comment:", error)
    return { error: error.message || "Failed to add comment" }
  }
}
