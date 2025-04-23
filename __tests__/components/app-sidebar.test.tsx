import { render, screen } from "@testing-library/react"
import { AppSidebar } from "@/components/app-sidebar"

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  usePathname: () => "/dashboard",
}))

describe("AppSidebar", () => {
  it("renders the sidebar with navigation links", () => {
    render(<AppSidebar />)

    // Check for the logo and title
    expect(screen.getByText("BugTracker")).toBeInTheDocument()

    // Check for main navigation links
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Projects")).toBeInTheDocument()
    expect(screen.getByText("Bugs")).toBeInTheDocument()
    expect(screen.getByText("Reports")).toBeInTheDocument()

    // Check for admin navigation links
    expect(screen.getByText("Users")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()

    // Check for user profile in footer
    expect(screen.getByText("John Doe")).toBeInTheDocument()
  })

  it("highlights the active link based on current path", () => {
    render(<AppSidebar />)

    // The Dashboard link should be highlighted as active
    const dashboardLink = screen.getByText("Dashboard").closest("a")
    expect(dashboardLink).toHaveAttribute("data-active", "true")

    // Other links should not be highlighted
    const homeLink = screen.getByText("Home").closest("a")
    expect(homeLink).not.toHaveAttribute("data-active", "true")
  })
})
