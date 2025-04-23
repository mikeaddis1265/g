import { render, screen } from "@testing-library/react"
import { BugsList } from "@/components/bugs/bugs-list"

describe("BugsList", () => {
  const mockBugs = [
    {
      id: "BUG-1001",
      title: "Login page crashes on mobile devices",
      description: "When attempting to login on mobile devices, the page crashes after submitting credentials.",
      status: "Open",
      priority: "High",
      severity: "Major",
      project: "E-commerce Platform",
      assignee: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      created: "2 days ago",
      updated: "4 hours ago",
      tags: ["mobile", "authentication", "crash"],
    },
    {
      id: "BUG-1002",
      title: "Payment processing error on checkout",
      description: "Users receive an error when attempting to complete payment during checkout process.",
      status: "In Progress",
      priority: "Critical",
      severity: "Critical",
      project: "E-commerce Platform",
      assignee: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SK",
      },
      created: "3 days ago",
      updated: "1 day ago",
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
    expect(screen.getByText("Open")).toBeInTheDocument()
    expect(screen.getByText("In Progress")).toBeInTheDocument()

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
