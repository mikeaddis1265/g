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
  const userId = session.user.id

  try {
    // Get all projects where the user is a member
    const projectMemberships = await prisma.projectMember.findMany({
      where: {
        userId,
      },
      select: {
        projectId: true,
      },
    })

    const projectIds = projectMemberships.map((membership) => membership.projectId)

    if (projectIds.length === 0) {
      return NextResponse.json({ projects: [] })
    }

    // Get projects with member count and bug stats
    const projects = await prisma.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
      },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          take: 5,
        },
        _count: {
          select: {
            members: true,
          },
        },
        bugs: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Transform the data for the frontend
    const projectsWithStats = projects.map((project) => {
      const bugStats = {
        total: project.bugs.length,
        open: project.bugs.filter((bug) => bug.status === "OPEN").length,
        inProgress: project.bugs.filter((bug) => bug.status === "IN_PROGRESS").length,
        resolved: project.bugs.filter((bug) => bug.status === "RESOLVED").length,
        closed: project.bugs.filter((bug) => bug.status === "CLOSED").length,
      }

      return {
        ...project,
        bugs: bugStats,
        team: project.members.map((member) => member.user),
        members: project._count.members,
        _count: undefined,
      }
    })

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

    // Create the project and add the creator as a member in one transaction
    const project = await prisma.$transaction(async (tx) => {
      // Create the project
      const newProject = await tx.project.create({
        data: {
          name,
          description: description || "",
          createdById: session.user.id,
        },
      })

      // Add the creator as a project member with owner role
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          userId: session.user.id,
          role: "OWNER",
        },
      })

      return newProject
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
