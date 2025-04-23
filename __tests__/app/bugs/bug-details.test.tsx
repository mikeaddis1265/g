import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import BugDetailPage from "@/app/bugs/[id]/page"
import { updateBug, addComment } from "@/lib/actions/bug-actions"

// Mock the modules
jest.mock("next/navigation")
jest.mock("@/lib/actions/bug-actions")

// Mock fetch for bug details
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        bug: {
          id: "bug-123",
          title: "Login button not working",
          description: "The login button does not respond when clicked.",
          status: "open",
          priority: "high",
          severity: "major",
          created_at: "2023-01-01T00:00:00.000Z",
          updated_at: "2023-01-01T00:00:00.000Z",
          reporter: {
            first_name: "John",
            last_name: "Doe",
            avatar_url: null,
          },
          assignee: null,
          projects: {
            id: "project-1",
            name: "E-commerce Platform",
          },
          tags: ["login", "ui"],
        },
        comments: [],
        activity: [],
        attachments: [],
      }),
  }),
)

describe("Bug Details Page", () => {
  const mockUpdateBug = updateBug as jest.Mock
  const mockAddComment = addComment as jest.Mock

  beforeEach(() => {
    mockUpdateBug.mockReset()
    mockAddComment.mockReset()
  })

  it("renders the bug details", async () => {
    render(<BugDetailPage params={{ id: "bug-123" }} />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Login button not working")).toBeInTheDocument()
    })

    // Check for bug details
    expect(screen.getByText("The login button does not respond when clicked.")).toBeInTheDocument()
    expect(screen.getByText("E-commerce Platform")).toBeInTheDocument()
    expect(screen.getByText("John Doe")).toBeInTheDocument()

    // Check for status and priority
    expect(screen.getByText("High / Major")).toBeInTheDocument()

    // Check for tags
    expect(screen.getByText("login")).toBeInTheDocument()
    expect(screen.getByText("ui")).toBeInTheDocument()
  })

  it("allows updating bug status", async () => {
    mockUpdateBug.mockResolvedValue({
      bug: {
        id: "bug-123",
        status: "in_progress",
      },
    })

    render(<BugDetailPage params={{ id: "bug-123" }} />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Login button not working")).toBeInTheDocument()
    })

    // Change status
    fireEvent.click(screen.getByText("Select status"))
    fireEvent.click(screen.getByText("In Progress"))

    // Update the bug
    fireEvent.click(screen.getByRole("button", { name: "Update" }))

    // Check if updateBug was called with the correct arguments
    await waitFor(() => {
      expect(mockUpdateBug).toHaveBeenCalledWith({
        id: "bug-123",
        status: "in_progress",
        priority: "high",
        severity: "major",
        assignee_id: "",
      })
    })
  })

  it("allows adding comments", async () => {
    mockAddComment.mockResolvedValue({
      comment: {
        id: "comment-1",
        content: "This is a test comment",
        created_at: "2023-01-01T00:00:00.000Z",
        users: {
          first_name: "John",
          last_name: "Doe",
          avatar_url: null,
        },
      },
    })

    render(<BugDetailPage params={{ id: "bug-123" }} />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("Login button not working")).toBeInTheDocument()
    })

    // Add a comment
    fireEvent.change(screen.getByPlaceholderText("Add a comment..."), {
      target: { value: "This is a test comment" },
    })

    fireEvent.click(screen.getByRole("button", { name: "Comment" }))

    // Check if addComment was called with the correct arguments
    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith("bug-123", "This is a test comment")
    })
  })
})
