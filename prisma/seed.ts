import { PrismaClient, UserRole, MemberRole, BugStatus, BugPriority, BugSeverity } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
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
      role: UserRole.DEVELOPER,
      password: devPassword,
    },
  })

  console.log("Created developer user:", developer.email)

  // Create tester user
  const testerPassword = await hash("tester123", 10)
  const tester = await prisma.user.upsert({
    where: { email: "tester@example.com" },
    update: {},
    create: {
      email: "tester@example.com",
      firstName: "Tester",
      lastName: "User",
      role: UserRole.TESTER,
      password: testerPassword,
    },
  })

  console.log("Created tester user:", tester.email)

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
      role: MemberRole.OWNER,
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
      role: MemberRole.MEMBER,
    },
  })

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: tester.id,
      },
    },
    update: {},
    create: {
      projectId: project.id,
      userId: tester.id,
      role: MemberRole.MEMBER,
    },
  })

  console.log("Added users to project")

  // Create sample bugs
  const bug1 = await prisma.bug.upsert({
    where: { id: "bug-1" },
    update: {},
    create: {
      id: "bug-1",
      title: "Login page crashes on mobile devices",
      description: "When attempting to login on mobile devices, the page crashes after submitting credentials.",
      stepsToReproduce: "1. Go to login page on mobile\n2. Enter credentials\n3. Click login button\n4. Page crashes",
      projectId: project.id,
      status: BugStatus.OPEN,
      priority: BugPriority.HIGH,
      severity: BugSeverity.MAJOR,
      reporterId: tester.id,
      assigneeId: developer.id,
      tags: ["mobile", "authentication", "crash"],
    },
  })

  const bug2 = await prisma.bug.upsert({
    where: { id: "bug-2" },
    update: {},
    create: {
      id: "bug-2",
      title: "Payment processing error on checkout",
      description: "Users receive an error when attempting to complete payment during checkout process.",
      projectId: project.id,
      status: BugStatus.IN_PROGRESS,
      priority: BugPriority.CRITICAL,
      severity: BugSeverity.CRITICAL,
      reporterId: tester.id,
      assigneeId: developer.id,
      tags: ["payment", "checkout", "error"],
    },
  })

  console.log("Created sample bugs")

  // Add comments and activities
  await prisma.bugComment.create({
    data: {
      bugId: bug1.id,
      userId: developer.id,
      content: "I can reproduce this issue on Android devices. Working on a fix.",
    },
  })

  await prisma.bugActivity.create({
    data: {
      bugId: bug1.id,
      userId: tester.id,
      action: "created",
      details: "this bug",
    },
  })

  await prisma.bugActivity.create({
    data: {
      bugId: bug1.id,
      userId: admin.id,
      action: "assigned bug",
      details: `to ${developer.firstName} ${developer.lastName}`,
    },
  })

  console.log("Added comments and activities")

  console.log("Database seeding completed")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
