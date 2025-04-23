"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"

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

    // Create the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: input.name,
        description: input.description || "",
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
  role: "owner" | "member"
}

export async function addProjectMember(input: AddProjectMemberInput) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    // Check if user is project owner
    const { data: membership, error: membershipError } = await supabase
      .from("project_members")
      .select("role")
      .eq("project_id", input.projectId)
      .eq("user_id", session.user.id)
      .single()

    if (membershipError) {
      throw membershipError
    }

    if (membership.role !== "owner") {
      return { error: "Only project owners can add members" }
    }

    // Check if user is already a member
    const { data: existingMember, error: existingMemberError } = await supabase
      .from("project_members")
      .select("id")
      .eq("project_id", input.projectId)
      .eq("user_id", input.userId)

    if (existingMember && existingMember.length > 0) {
      return { error: "User is already a member of this project" }
    }

    // Add the member
    const { data: member, error: addMemberError } = await supabase
      .from("project_members")
      .insert({
        project_id: input.projectId,
        user_id: input.userId,
        role: input.role,
      })
      .select()
      .single()

    if (addMemberError) {
      throw addMemberError
    }

    revalidatePath(`/projects/${input.projectId}`)

    return { member }
  } catch (error: any) {
    console.error("Error adding project member:", error)
    return { error: error.message || "Failed to add project member" }
  }
}
