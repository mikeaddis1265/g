import { Pool } from "pg"
import fs from "fs"
import path from "path"

async function setupLocalDatabase() {
  // Create a connection pool
  const pool = new Pool({
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "19948miko",
    host: process.env.POSTGRES_HOST || "localhost",
    port: 5432,
    database: process.env.POSTGRES_DATABASE || "bug_tracker",
  })

  try {
    console.log("Setting up local database...")

    // Read the schema SQL file
    const schemaSQL = fs.readFileSync(path.join(process.cwd(), "lib/supabase/schema.sql"), "utf8")

    // Execute the schema SQL
    await pool.query(schemaSQL)
    console.log("Database schema created successfully")

    // Check if admin user exists
    const existingAdminResult = await pool.query("SELECT id FROM users WHERE email = 'admin@example.com'")

    if (existingAdminResult.rows.length === 0) {
      // Create admin user
      const adminId = "admin-" + Date.now()
      await pool.query(
        `INSERT INTO users (id, email, first_name, last_name, role) 
         VALUES ($1, $2, $3, $4, $5)`,
        [adminId, "admin@example.com", "Admin", "User", "admin"],
      )
      console.log("Admin user created")

      // Create sample project
      const projectResult = await pool.query(
        `INSERT INTO projects (name, description, created_by) 
         VALUES ($1, $2, $3) RETURNING id`,
        ["Sample Project", "A sample project for demonstration", adminId],
      )
      const projectId = projectResult.rows[0].id

      // Add admin as project owner
      await pool.query(
        `INSERT INTO project_members (project_id, user_id, role) 
         VALUES ($1, $2, $3)`,
        [projectId, adminId, "owner"],
      )
      console.log("Sample project created")
    }

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Check if this script is being run directly
if (require.main === module) {
  setupLocalDatabase().catch(console.error)
}

export { setupLocalDatabase }
