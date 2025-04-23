import { initializeDatabase, seedDatabase } from "../lib/supabase/init-db"

async function setup() {
  console.log("Setting up database...")

  const initResult = await initializeDatabase()
  if (initResult.error) {
    console.error("Database initialization failed:", initResult.error)
    process.exit(1)
  }

  const seedResult = await seedDatabase()
  if (seedResult.error) {
    console.error("Database seeding failed:", seedResult.error)
    process.exit(1)
  }

  console.log("Database setup completed successfully")
  process.exit(0)
}

setup().catch((error) => {
  console.error("Unhandled error during setup:", error)
  process.exit(1)
})
