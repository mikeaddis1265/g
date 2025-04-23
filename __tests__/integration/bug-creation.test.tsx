import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useRouter } from "next/navigation"
import NewBugPage from "@/app/bugs/new/page"
import { createBug } from "@/lib/actions/bug-actions"
import { useToast } from "@/hooks/use-toast"

// Mock the modules
jest.mock("next/navigation")
jest.mock("@/lib/actions/bug-actions")
jest.mock("@/hooks/use-toast")

describe("Bug Creation Flow", () => {
  const mockRouter = useRouter as jest.Mock
  const mockPush = jest.fn()
  const mockBack = jest.fn()
  const mockCreateBug = createBug as jest.Mock
  const mockToast = jest.fn()

  beforeEach(() => {
    mockRouter.mockImplementation(() => ({
      push: mockPush,
      back: mockBack,
    }))
    mockCreateBug.mockReset()
    ;(useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    })
  })

  it("allows users to create a new bug report", async () => {
    mockCreateBug.mockResolvedValue({ bug: { id: "bug-123" } })

    render(<NewBugPage />)

    // Fill in the bug report form
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Login button not working" },
    })

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "The login button does not respond when clicked." },
    })

    fireEvent.change(screen.getByLabelText("Steps to Reproduce"), {
      target: { value: "1. Go to login page\n2. Click login button\n3. Nothing happens" },
    })

    // Select project
    fireEvent.click(screen.getByText("Select project"))
    fireEvent.click(screen.getByText("E-commerce Platform"))

    // Select priority
    fireEvent.click(screen.getByText("Select priority"))
    fireEvent.click(screen.getByText("High"))

    // Select severity
    fireEvent.click(screen.getByText("Select severity"))
    fireEvent.click(screen.getByText("Major"))

    // Add a tag
    fireEvent.change(screen.getByPlaceholderText("Add a tag"), {
      target: { value: "login" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Add tag" }))

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Submit Bug Report" }))

    // Check if createBug was called with the correct arguments
    await waitFor(() => {
      expect(mockCreateBug).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Login button not working",
          description: "The login button does not respond when clicked.",
          steps_to_reproduce: "1. Go to login page\n2. Click login button\n3. Nothing happens",
          project_id: "project-1",
          priority: "HIGH",
          severity: "MAJOR",
          tags: ["login"],
        }),
      )
    })

    // Check if toast was called with success message
    expect(mockToast).toHaveBeenCalledWith({
      title: "Bug created",
      description: "Your bug has been reported successfully",
    })

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/bugs/bug-123")
  })

  it("displays an error message when bug creation fails", async () => {
    mockCreateBug.mockResolvedValue({ error: "Failed to create bug" })

    render(<NewBugPage />)

    // Fill in minimal required fields
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Bug" },
    })

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    })

    // Select project
    fireEvent.click(screen.getByText("Select project"))
    fireEvent.click(screen.getByText("E-commerce Platform"))

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Submit Bug Report" }))

    // Check if createBug was called
    await waitFor(() => {
      expect(mockCreateBug).toHaveBeenCalled()
    })

    // Check if toast was called with error message
    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Failed to create bug",
      variant: "destructive",
    })

    // Router should not be called on error
    expect(mockPush).not.toHaveBeenCalled()
  })
})
