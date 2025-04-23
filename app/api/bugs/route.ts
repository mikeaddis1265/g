import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  const status = searchParams.get("status")
  const priority = searchParams.get("priority")
  const assigneeId = searchParams.get("assigneeId")
  const search = searchParams.get("search")
  const sort = searchParams.get("sort") || "newest"

  try {
    let query = supabase.from("bugs").select(`
        *,
        projects(name),
        reporter:reporter_id(id, first_name, last_name, avatar_url),
        assignee:assignee_id(id, first_name, last_name, avatar_url)
      `)

    // Apply filters
    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (priority) {
      query = query.eq("priority", priority)
    }

    if (assigneeId) {
      query = query.eq("assignee_id", assigneeId)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    if (sort === "newest") {
      query = query.order("created_at", { ascending: false })
    } else if (sort === "oldest") {
      query = query.order("created_at", { ascending: true })
    } else if (sort === "priority") {
      // Custom priority order: critical, high, medium, low
      query = query.order("priority", {
        ascending: false,
        nullsFirst: false,
        foreignTable: null,
      })
    } else if (sort === "status") {
      // Custom status order: open, in_progress, testing, resolved, closed
      query = query.order("status", {
        ascending: true,
        nullsFirst: false,
        foreignTable: null,
      })
    }

    const { data: bugs, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ bugs })
  } catch (error) {
    console.error("Error fetching bugs:", error)
    return NextResponse.json({ error: "Failed to fetch bugs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, description, steps_to_reproduce, project_id, priority, severity, assignee_id, tags } =
      await request.json()

    if (!title || !description || !project_id) {
      return NextResponse.json(
        {
          error: "Title, description, and project are required",
        },
        { status: 400 },
      )
    }

    // Create the bug
    const { data: bug, error: bugError } = await supabase
      .from("bugs")
      .insert({
        title,
        description,
        steps_to_reproduce,
        project_id,
        status: "open",
        priority: priority || "medium",
        severity: severity || "minor",
        reporter_id: session.user.id,
        assignee_id,
        tags,
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

    return NextResponse.json({ bug })
  } catch (error) {
    console.error("Error creating bug:", error)
    return NextResponse.json({ error: "Failed to create bug" }, { status: 500 })
  }
}
