import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bugId = params.id

  try {
    // Get the bug details
    const { data: bug, error: bugError } = await supabase
      .from("bugs")
      .select(`
        *,
        projects(id, name),
        reporter:reporter_id(id, first_name, last_name, avatar_url),
        assignee:assignee_id(id, first_name, last_name, avatar_url)
      `)
      .eq("id", bugId)
      .single()

    if (bugError) {
      throw bugError
    }

    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from("bug_comments")
      .select(`
        *,
        users(id, first_name, last_name, avatar_url)
      `)
      .eq("bug_id", bugId)
      .order("created_at", { ascending: true })

    if (commentsError) {
      throw commentsError
    }

    // Get activity
    const { data: activity, error: activityError } = await supabase
      .from("bug_activity")
      .select(`
        *,
        users(id, first_name, last_name, avatar_url)
      `)
      .eq("bug_id", bugId)
      .order("created_at", { ascending: true })

    if (activityError) {
      throw activityError
    }

    // Get attachments
    const { data: attachments, error: attachmentsError } = await supabase
      .from("bug_attachments")
      .select(`
        *,
        users(id, first_name, last_name, avatar_url)
      `)
      .eq("bug_id", bugId)
      .order("created_at", { ascending: true })

    if (attachmentsError) {
      throw attachmentsError
    }

    return NextResponse.json({
      bug,
      comments,
      activity,
      attachments,
    })
  } catch (error) {
    console.error("Error fetching bug details:", error)
    return NextResponse.json({ error: "Failed to fetch bug details" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bugId = params.id

  try {
    const updates = await request.json()
    const allowedFields = [
      "title",
      "description",
      "steps_to_reproduce",
      "status",
      "priority",
      "severity",
      "assignee_id",
      "tags",
    ]

    // Filter out any fields that aren't allowed
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce(
        (obj, key) => {
          obj[key] = updates[key]
          return obj
        },
        {} as Record<string, any>,
      )

    // Add updated_at timestamp
    filteredUpdates.updated_at = new Date().toISOString()

    // Get the current bug state for comparison
    const { data: currentBug, error: currentBugError } = await supabase
      .from("bugs")
      .select("*")
      .eq("id", bugId)
      .single()

    if (currentBugError) {
      throw currentBugError
    }

    // Update the bug
    const { data: bug, error: updateError } = await supabase
      .from("bugs")
      .update(filteredUpdates)
      .eq("id", bugId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Record activities for each changed field
    const activities = []

    for (const [key, value] of Object.entries(filteredUpdates)) {
      if (key !== "updated_at" && currentBug[key] !== value) {
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
          bug_id: bugId,
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

    return NextResponse.json({ bug })
  } catch (error) {
    console.error("Error updating bug:", error)
    return NextResponse.json({ error: "Failed to update bug" }, { status: 500 })
  }
}
