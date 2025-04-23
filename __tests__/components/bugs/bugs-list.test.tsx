import { render, screen } from "@testing-library/react"
import { BugsList } from "@/components/bugs/bugs-list"

describe("BugsList", () => {
  const mockBugs = [
    {
      id: "BUG-1001",
      title: "Login page crashes on mobile devices",
      description: "When attempting to login on mobile devices, the page crashes after submitting credentials.",
      status: "OPEN",
      priority: "HIGH",
      severity: "MAJOR",
      project: {
        name: "E-commerce Platform",
      },
      assignee: {
        firstName: "John",
        lastName: "Doe",
        avatarUrl: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T12:00:00.000Z",
      tags: ["mobile", "authentication", "crash"],
    },
    {
      id: "BUG-1002",
      title: "Payment processing error on checkout",
      description: "Users receive an error when attempting to complete payment during checkout process.",
      status: "IN_PROGRESS",
      priority: "CRITICAL",
      severity: "CRITICAL",
      project: {
        name: "E-commerce Platform",
      },
      assignee: {
        firstName: "Sarah",
        lastName: "Kim",
        avatarUrl: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2023-01-02T00:00:00.000Z",
      updatedAt: "2023-01-02T12:00:00.000Z",
      tags: ["payment", "checkout", "error"],
    },
  ]

  it("renders a list of bugs", () => {
    render(<BugsList bugs={mockBugs} />)

    // Check if bug titles are rendered
    expect(screen.getByText("Login page crashes on mobile devices")).toBeInTheDocument()
    expect(screen.getByText("Payment processing error on checkout")).toBeInTheDocument()

    // Check if bug IDs are rendered
    expect(screen.getByText("BUG-1001")).toBeInTheDocument()
    expect(screen.getByText("BUG-1002")).toBeInTheDocument()

    // Check if bug statuses are rendered
    expect(screen.getByText("OPEN")).toBeInTheDocument()
    expect(screen.getByText("IN_PROGRESS")).toBeInTheDocument()

    // Check if bug tags are rendered
    expect(screen.getByText("mobile")).toBeInTheDocument()
    expect(screen.getByText("authentication")).toBeInTheDocument()
    expect(screen.getByText("crash")).toBeInTheDocument()
    expect(screen.getByText("payment")).toBeInTheDocument()
    expect(screen.getByText("checkout")).toBeInTheDocument()
    expect(screen.getByText("error")).toBeInTheDocument()
  })

  it("renders an empty state when no bugs are provided", () => {
    render(<BugsList bugs={[]} />)

    expect(screen.getByText("No bugs found")).toBeInTheDocument()
  })
})
