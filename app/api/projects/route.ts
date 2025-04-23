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
  const userId = session.user.id

  try {
    // Get all projects where the user is a member
    const { data: projectMemberships, error: membershipError } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("user_id", userId)

    if (membershipError) {
      throw membershipError
    }

    const projectIds = projectMemberships.map((membership) => membership.project_id)

    if (projectIds.length === 0) {
      return NextResponse.json({ projects: [] })
    }

    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(`
        *,
        project_members!inner(user_id),
        bugs(count)
      `)
      .in("id", projectIds)
      .order("updated_at", { ascending: false })

    if (projectsError) {
      throw projectsError
    }

    // Get bug statistics for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const { data: bugStats, error: bugStatsError } = await supabase
          .from("bugs")
          .select("status")
          .eq("project_id", project.id)

        if (bugStatsError) {
          throw bugStatsError
        }

        const stats = {
          total: bugStats.length,
          open: bugStats.filter((bug) => bug.status === "open").length,
          inProgress: bugStats.filter((bug) => bug.status === "in_progress").length,
          resolved: bugStats.filter((bug) => bug.status === "resolved").length,
          closed: bugStats.filter((bug) => bug.status === "closed").length,
        }

        // Get team members
        const { data: members, error: membersError } = await supabase
          .from("project_members")
          .select(`
            users(id, first_name, last_name, avatar_url)
          `)
          .eq("project_id", project.id)
          .limit(5)

        if (membersError) {
          throw membersError
        }

        return {
          ...project,
          bugs: stats,
          team: members.map((member) => member.users),
          members: project.project_members.length,
        }
      }),
    )

    return NextResponse.json({ projects: projectsWithStats })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    // Create the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        created_by: session.user.id,
      })
      .select()
      .single()

    if (projectError) {
      throw projectError
    }

    // Add the creator as a project member with owner role
    const { error: memberError } = await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: session.user.id,
      role: "owner",
    })

    if (memberError) {
      throw memberError
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
