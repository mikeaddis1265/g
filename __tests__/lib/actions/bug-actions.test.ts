import { createBug, updateBug, addComment } from "@/lib/actions/bug-actions"
import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

// Mock the modules
jest.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(() =>
    Promise.resolve({
      user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
      },
    }),
  ),
}))

describe("Bug Actions", () => {
  const mockFrom = supabase.from as jest.Mock
  const mockInsert = jest.fn()
  const mockUpdate = jest.fn()
  const mockSelect = jest.fn()
  const mockEq = jest.fn()
  const mockSingle = jest.fn()
  const mockRevalidatePath = revalidatePath as jest.Mock

  beforeEach(() => {
    mockFrom.mockReturnValue({
      insert: mockInsert,
      update: mockUpdate,
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    })

    mockInsert.mockReturnValue({
      select: mockSelect,
    })

    mockUpdate.mockReturnValue({
      eq: mockEq,
    })

    mockSelect.mockReturnValue({
      eq: mockEq,
      single: mockSingle,
    })

    mockEq.mockReturnValue({
      select: mockSelect,
      single: mockSingle,
    })

    mockRevalidatePath.mockReset()
  })

  describe("createBug", () => {
    it("creates a new bug", async () => {
      const mockBug = {
        id: "bug-123",
        title: "Test Bug",
        description: "Test Description",
      }

      mockSingle.mockResolvedValueOnce({
        data: mockBug,
        error: null,
      })

      mockSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const result = await createBug({
        title: "Test Bug",
        description: "Test Description",
        project_id: "project-1",
        priority: "high",
        severity: "major",
      })

      expect(mockFrom).toHaveBeenCalledWith("bugs")
      expect(mockInsert).toHaveBeenCalledWith({
        title: "Test Bug",
        description: "Test Description",
        project_id: "project-1",
        status: "open",
        priority: "high",
        severity: "major",
        reporter_id: "user-123",
        assignee_id: null,
        steps_to_reproduce: null,
        tags: [],
      })
      expect(result).toEqual({ bug: mockBug })
    })

    it("returns an error if required fields are missing", async () => {
      const result = await createBug({
        title: "",
        description: "Test Description",
        project_id: "project-1",
        priority: "high",
        severity: "major",
      })

      expect(result).toEqual({ error: "Title, description, and project are required" })
    })
  })

  describe("updateBug", () => {
    it("updates an existing bug", async () => {
      const mockBug = {
        id: "bug-123",
        status: "in_progress",
      }

      mockSingle.mockResolvedValueOnce({
        data: { status: "open" },
        error: null,
      })

      mockSingle.mockResolvedValueOnce({
        data: mockBug,
        error: null,
      })

      mockSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const result = await updateBug({
        id: "bug-123",
        status: "in_progress",
      })

      expect(mockFrom).toHaveBeenCalledWith("bugs")
      expect(mockUpdate).toHaveBeenCalledWith({
        status: "in_progress",
        updated_at: expect.any(String),
      })
      expect(mockEq).toHaveBeenCalledWith("id", "bug-123")
      expect(mockRevalidatePath).toHaveBeenCalledWith("/bugs/bug-123")
      expect(mockRevalidatePath).toHaveBeenCalledWith("/bugs")
      expect(result).toEqual({ bug: mockBug })
    })
  })

  describe("addComment", () => {
    it("adds a comment to a bug", async () => {
      const mockComment = {
        id: "comment-1",
        content: "Test Comment",
      }

      mockSingle.mockResolvedValueOnce({
        data: mockComment,
        error: null,
      })

      mockSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const result = await addComment("bug-123", "Test Comment")

      expect(mockFrom).toHaveBeenCalledWith("bug_comments")
      expect(mockInsert).toHaveBeenCalledWith({
        bug_id: "bug-123",
        user_id: "user-123",
        content: "Test Comment",
      })
      expect(mockRevalidatePath).toHaveBeenCalledWith("/bugs/bug-123")
      expect(result).toEqual({ comment: mockComment })
    })

    it("returns an error if content is empty", async () => {
      const result = await addComment("bug-123", "")

      expect(result).toEqual({ error: "Comment content is required" })
    })
  })
})
