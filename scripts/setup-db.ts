import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

async function setup() {
  console.log("Setting up database...")

  const prisma = new PrismaClient()

  try {
    // Push the schema to the database
    console.log("Pushing schema to database...")
    // This would normally be done with prisma db push, but we'll simulate it here

    // Seed the database with initial data
    console.log("Seeding database with initial data...")

    // Create admin user
    const adminPassword = await hash("admin123", 10)
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        password: adminPassword,
      },
    })

    console.log("Created admin user:", admin.email)

    // Create developer user
    const devPassword = await hash("dev123", 10)
    const developer = await prisma.user.upsert({
      where: { email: "dev@example.com" },
      update: {},
      create: {
        email: "dev@example.com",
        firstName: "Developer",
        lastName: "User",
        role: "DEVELOPER",
        password: devPassword,
      },
    })

    console.log("Created developer user:", developer.email)

    // Create sample project
    const project = await prisma.project.upsert({
      where: { id: "sample-project" },
      update: {},
      create: {
        id: "sample-project",
        name: "Sample Project",
        description: "A sample project for demonstration",
        createdById: admin.id,
      },
    })

    console.log("Created sample project:", project.name)

    // Add users as project members
    await prisma.projectMember.upsert({
      where: {
        projectId_userId: {
          projectId: project.id,
          userId: admin.id,
        },
      },
      update: {},
      create: {
        projectId: project.id,
        userId: admin.id,
        role: "OWNER",
      },
    })

    await prisma.projectMember.upsert({
      where: {
        projectId_userId: {
          projectId: project.id,
          userId: developer.id,
        },
      },
      update: {},
      create: {
        projectId: project.id,
        userId: developer.id,
        role: "MEMBER",
      },
    })

    console.log("Added users to project")

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the setup function
setup().catch(console.error)
