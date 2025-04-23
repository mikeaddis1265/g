import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bugId = params.id

  try {
    // Get the bug details
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
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
    })

    if (!bug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    // Get comments
    const comments = await prisma.bugComment.findMany({
      where: { bugId },
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
      orderBy: { createdAt: "asc" },
    })

    // Get activity
    const activity = await prisma.bugActivity.findMany({
      where: { bugId },
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
      orderBy: { createdAt: "asc" },
    })

    // Get attachments
    const attachments = await prisma.bugAttachment.findMany({
      where: { bugId },
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
      orderBy: { createdAt: "asc" },
    })

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
      "stepsToReproduce",
      "status",
      "priority",
      "severity",
      "assigneeId",
      "tags",
    ]

    // Filter out any fields that aren't allowed
    const filteredUpdates: Record<string, any> = {}
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key]
      }
    }

    // Get the current bug state for comparison
    const currentBug = await prisma.bug.findUnique({
      where: { id: bugId },
    })

    if (!currentBug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    // Update the bug
    const bug = await prisma.bug.update({
      where: { id: bugId },
      data: filteredUpdates,
    })

    // Record activities for each changed field
    const activities = []

    if (updates.status && currentBug.status !== updates.status) {
      activities.push({
        bugId,
        userId: session.user.id,
        action: "changed status",
        details: `from ${currentBug.status} to ${updates.status}`,
      })
    }

    if (updates.assigneeId !== undefined && currentBug.assigneeId !== updates.assigneeId) {
      let details = "to unassigned"

      if (updates.assigneeId) {
        // Get the assignee name
        const assignee = await prisma.user.findUnique({
          where: { id: updates.assigneeId },
          select: { firstName: true, lastName: true },
        })

        if (assignee) {
          details = `to ${assignee.firstName} ${assignee.lastName}`
        }
      }

      activities.push({
        bugId,
        userId: session.user.id,
        action: "assigned bug",
        details,
      })
    }

    if (activities.length > 0) {
      await prisma.bugActivity.createMany({
        data: activities,
      })
    }

    return NextResponse.json({ bug })
  } catch (error) {
    console.error("Error updating bug:", error)
    return NextResponse.json({ error: "Failed to update bug" }, { status: 500 })
  }
}
