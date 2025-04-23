"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MemberRole } from "@prisma/client"

type CreateProjectInput = {
  name: string
  description: string
}

export async function createProject(input: CreateProjectInput) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    if (!input.name) {
      return { error: "Project name is required" }
    }

    // Create the project and add the creator as a member in one transaction
    const project = await prisma.$transaction(async (tx) => {
      // Create the project
      const newProject = await tx.project.create({
        data: {
          name: input.name,
          description: input.description || "",
          createdById: session.user.id,
        },
      })

      // Add the creator as a project member with owner role
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          userId: session.user.id,
          role: MemberRole.OWNER,
        },
      })

      return newProject
    })

    revalidatePath("/projects")

    return { project }
  } catch (error: any) {
    console.error("Error creating project:", error)
    return { error: error.message || "Failed to create project" }
  }
}

type AddProjectMemberInput = {
  projectId: string
  userId: string
  role: "OWNER" | "MEMBER"
}

export async function addProjectMember(input: AddProjectMemberInput) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    // Check if user is project owner
    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId: input.projectId,
        userId: session.user.id,
        role: MemberRole.OWNER,
      },
    })

    if (!membership) {
      return { error: "Only project owners can add members" }
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findFirst({
      where: {
        projectId: input.projectId,
        userId: input.userId,
      },
    })

    if (existingMember) {
      return { error: "User is already a member of this project" }
    }

    // Add the member
    const member = await prisma.projectMember.create({
      data: {
        projectId: input.projectId,
        userId: input.userId,
        role: input.role as MemberRole,
      },
    })

    revalidatePath(`/projects/${input.projectId}`)

    return { member }
  } catch (error: any) {
    console.error("Error adding project member:", error)
    return { error: error.message || "Failed to add project member" }
  }
}
