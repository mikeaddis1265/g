import { createBug, updateBug, addComment } from "@/lib/actions/bug-actions"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

// Mock the modules
jest.mock("@/lib/prisma", () => ({
  prisma: {
    bug: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    bugActivity: {
      create: jest.fn(),
      createMany: jest.fn(),
    },
    bugComment: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}))

describe("Bug Actions", () => {
  const mockSession = {
    user: {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  })

  describe("createBug", () => {
    it("creates a new bug", async () => {
      const mockBug = {
        id: "bug-123",
        title: "Test Bug",
        description: "Test Description",
      }
      ;(prisma.bug.create as jest.Mock).mockResolvedValue(mockBug)
      ;(prisma.bugActivity.create as jest.Mock).mockResolvedValue({})

      const result = await createBug({
        title: "Test Bug",
        description: "Test Description",
        project_id: "project-1",
        priority: "HIGH",
        severity: "MAJOR",
      })

      expect(prisma.bug.create).toHaveBeenCalledWith({
        data: {
          title: "Test Bug",
          description: "Test Description",
          projectId: "project-1",
          status: "OPEN",
          priority: "HIGH",
          severity: "MAJOR",
          reporterId: "user-123",
          assigneeId: null,
          stepsToReproduce: null,
          tags: [],
        },
      })

      expect(prisma.bugActivity.create).toHaveBeenCalledWith({
        data: {
          bugId: "bug-123",
          userId: "user-123",
          action: "created",
          details: "this bug",
        },
      })

      expect(revalidatePath).toHaveBeenCalledWith("/bugs")
      expect(revalidatePath).toHaveBeenCalledWith("/projects/project-1")

      expect(result).toEqual({ bug: mockBug })
    })

    it("returns an error if required fields are missing", async () => {
      const result = await createBug({
        title: "",
        description: "Test Description",
        project_id: "project-1",
        priority: "HIGH",
        severity: "MAJOR",
      })

      expect(result).toEqual({ error: "Title, description, and project are required" })
      expect(prisma.bug.create).not.toHaveBeenCalled()
    })

    it("returns an error if user is not authenticated", async () => {
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const result = await createBug({
        title: "Test Bug",
        description: "Test Description",
        project_id: "project-1",
        priority: "HIGH",
        severity: "MAJOR",
      })

      expect(result).toEqual({ error: "Unauthorized" })
      expect(prisma.bug.create).not.toHaveBeenCalled()
    })
  })

  describe("updateBug", () => {
    it("updates an existing bug", async () => {
      const mockBug = {
        id: "bug-123",
        status: "IN_PROGRESS",
        priority: "HIGH",
        severity: "MAJOR",
        projectId: "project-1",
      }
      ;(prisma.bug.findUnique as jest.Mock).mockResolvedValue({
        id: "bug-123",
        status: "OPEN",
        priority: "MEDIUM",
        severity: "MINOR",
      })
      ;(prisma.bug.update as jest.Mock).mockResolvedValue(mockBug)
      ;(prisma.bugActivity.createMany as jest.Mock).mockResolvedValue({})

      const result = await updateBug({
        id: "bug-123",
        status: "IN_PROGRESS",
        priority: "HIGH",
        severity: "MAJOR",
      })

      expect(prisma.bug.findUnique).toHaveBeenCalledWith({
        where: { id: "bug-123" },
      })

      expect(prisma.bug.update).toHaveBeenCalledWith({
        where: { id: "bug-123" },
        data: {
          status: "IN_PROGRESS",
          priority: "HIGH",
          severity: "MAJOR",
        },
      })

      expect(prisma.bugActivity.createMany).toHaveBeenCalledWith({
        data: [
          {
            bugId: "bug-123",
            userId: "user-123",
            action: "changed status",
            details: "from OPEN to IN_PROGRESS",
          },
          {
            bugId: "bug-123",
            userId: "user-123",
            action: "updated priority",
            details: "to HIGH",
          },
          {
            bugId: "bug-123",
            userId: "user-123",
            action: "updated severity",
            details: "to MAJOR",
          },
        ],
      })

      expect(revalidatePath).toHaveBeenCalledWith("/bugs/bug-123")
      expect(revalidatePath).toHaveBeenCalledWith("/bugs")
      expect(revalidatePath).toHaveBeenCalledWith("/projects/project-1")

      expect(result).toEqual({ bug: mockBug })
    })
  })

  describe("addComment", () => {
    it("adds a comment to a bug", async () => {
      const mockComment = {
        id: "comment-1",
        content: "Test Comment",
        user: {
          id: "user-123",
          firstName: "Test",
          lastName: "User",
        },
      }
      ;(prisma.bugComment.create as jest.Mock).mockResolvedValue(mockComment)
      ;(prisma.bugActivity.create as jest.Mock).mockResolvedValue({})

      const result = await addComment("bug-123", "Test Comment")

      expect(prisma.bugComment.create).toHaveBeenCalledWith({
        data: {
          bugId: "bug-123",
          userId: "user-123",
          content: "Test Comment",
        },
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
      })

      expect(prisma.bugActivity.create).toHaveBeenCalledWith({
        data: {
          bugId: "bug-123",
          userId: "user-123",
          action: "added comment",
          details: "Test Comment",
        },
      })

      expect(revalidatePath).toHaveBeenCalledWith("/bugs/bug-123")

      expect(result).toEqual({ comment: mockComment })
    })

    it("returns an error if content is empty", async () => {
      const result = await addComment("bug-123", "")

      expect(result).toEqual({ error: "Comment content is required" })
      expect(prisma.bugComment.create).not.toHaveBeenCalled()
    })
  })
})
