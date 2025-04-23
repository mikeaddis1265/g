"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase/client"

type CreateUserInput = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "developer" | "tester" | "manager" | "admin"
}

export async function createUser(input: CreateUserInput) {
  try {
    if (!input.email || !input.password || !input.firstName || !input.lastName) {
      return { error: "All fields are required" }
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", input.email).single()

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    })

    if (authError) {
      console.error("Auth error:", authError)
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: "Failed to create user" }
    }

    // Create user profile
    const { data: user, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        role: input.role,
      })
      .select()
      .single()

    if (profileError) {
      console.error("Profile error:", profileError)

      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)

      return { error: profileError.message }
    }

    return { user }
  } catch (error: any) {
    console.error("Error creating user:", error)
    return { error: error.message || "Failed to create user" }
  }
}

export async function getUserById(id: string) {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      throw error
    }

    return { user }
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return { error: error.message || "Failed to fetch user" }
  }
}

export async function updateUser(id: string, updates: Partial<Omit<CreateUserInput, "password" | "email">>) {
  try {
    const { data: user, error } = await supabase.from("users").update(updates).eq("id", id).select().single()

    if (error) {
      throw error
    }

    revalidatePath(`/users/${id}`)
    revalidatePath("/users")

    return { user }
  } catch (error: any) {
    console.error("Error updating user:", error)
    return { error: error.message || "Failed to update user" }
  }
}
