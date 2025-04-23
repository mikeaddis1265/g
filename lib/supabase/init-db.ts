import { supabase } from "./client"
import fs from "fs"
import path from "path"

export async function initializeDatabase() {
  try {
    console.log("Initializing database...")

    // Read the schema SQL file
    const schemaSQL = fs.readFileSync(path.join(process.cwd(), "lib/supabase/schema.sql"), "utf8")

    // Execute the schema SQL
    const { error } = await supabase.rpc("exec_sql", { sql: schemaSQL })

    if (error) {
      throw error
    }

    console.log("Database initialized successfully")
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { error: "Failed to initialize database" }
  }
}

export async function seedDatabase() {
  try {
    console.log("Seeding database with initial data...")

    // Check if admin user exists
    const { data: existingAdmin } = await supabase.from("users").select("id").eq("email", "admin@example.com").single()

    if (!existingAdmin) {
      // Create admin user in auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: "admin@example.com",
        password: "admin123",
      })

      if (authError) throw authError

      // Create admin user in users table
      const { error: userError } = await supabase.from("users").insert({
        id: authUser.user!.id,
        email: "admin@example.com",
        first_name: "Admin",
        last_name: "User",
        role: "admin",
      })

      if (userError) throw userError

      console.log("Admin user created")
    }

    // Create sample project if none exists
    const { data: existingProjects } = await supabase.from("projects").select("id").limit(1)

    if (!existingProjects || existingProjects.length === 0) {
      // Get admin user
      const { data: admin } = await supabase.from("users").select("id").eq("email", "admin@example.com").single()

      // Create sample project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: "Sample Project",
          description: "A sample project for demonstration",
          created_by: admin.id,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Add admin as project owner
      const { error: memberError } = await supabase.from("project_members").insert({
        project_id: project.id,
        user_id: admin.id,
        role: "owner",
      })

      if (memberError) throw memberError

      console.log("Sample project created")
    }

    console.log("Database seeded successfully")
    return { success: true }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { error: "Failed to seed database" }
  }
}
