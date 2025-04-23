"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"
import type { UserRole } from "@prisma/client"

type CreateUserInput = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "ADMIN" | "DEVELOPER" | "TESTER" | "MANAGER"
}

export async function createUser(input: CreateUserInput) {
  try {
    if (!input.email || !input.password || !input.firstName || !input.lastName) {
      return { error: "All fields are required" }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash the password
    const hashedPassword = await hash(input.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role as UserRole,
        password: hashedPassword,
      },
    })

    return { user: { ...user, password: undefined } }
  } catch (error: any) {
    console.error("Error creating user:", error)
    return { error: error.message || "Failed to create user" }
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return { error: "User not found" }
    }

    return { user: { ...user, password: undefined } }
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return { error: error.message || "Failed to fetch user" }
  }
}

export async function updateUser(id: string, updates: Partial<Omit<CreateUserInput, "password" | "email">>) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName: updates.firstName,
        lastName: updates.lastName,
        role: updates.role as UserRole | undefined,
      },
    })

    revalidatePath(`/users/${id}`)
    revalidatePath("/users")

    return { user: { ...user, password: undefined } }
  } catch (error: any) {
    console.error("Error updating user:", error)
    return { error: error.message || "Failed to update user" }
  }
}
