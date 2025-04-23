import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    // Build the where clause
    const where: any = {}

    if (projectId) {
      where.projectId = projectId
    }

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (assigneeId) {
      where.assigneeId = assigneeId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Build the orderBy clause
    let orderBy: any = {}

    if (sort === "newest") {
      orderBy = { createdAt: "desc" }
    } else if (sort === "oldest") {
      orderBy = { createdAt: "asc" }
    } else if (sort === "priority") {
      // Custom priority order: critical, high, medium, low
      orderBy = { priority: "desc" }
    } else if (sort === "status") {
      // Custom status order: open, in_progress, testing, resolved, closed
      orderBy = { status: "asc" }
    }

    // Get bugs with related data
    const bugs = await prisma.bug.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy,
    })

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
    const bug = await prisma.bug.create({
      data: {
        title,
        description,
        stepsToReproduce: steps_to_reproduce || null,
        projectId: project_id,
        status: "OPEN",
        priority: priority || "MEDIUM",
        severity: severity || "MINOR",
        reporterId: session.user.id,
        assigneeId: assignee_id || null,
        tags: tags || [],
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

    return NextResponse.json({ bug })
  } catch (error) {
    console.error("Error creating bug:", error)
    return NextResponse.json({ error: "Failed to create bug" }, { status: 500 })
  }
}
