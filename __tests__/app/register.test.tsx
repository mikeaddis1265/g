import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useRouter } from "next/navigation"
import RegisterPage from "@/app/register/page"
import { createUser } from "@/lib/actions/user-actions"
import { useToast } from "@/hooks/use-toast"

// Mock the modules
jest.mock("next/navigation")
jest.mock("@/lib/actions/user-actions")
jest.mock("@/hooks/use-toast")

describe("RegisterPage", () => {
  const mockRouter = useRouter as jest.Mock
  const mockPush = jest.fn()
  const mockCreateUser = createUser as jest.Mock
  const mockToast = jest.fn()

  beforeEach(() => {
    mockRouter.mockImplementation(() => ({
      push: mockPush,
    }))
    mockCreateUser.mockReset()
    ;(useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    })
  })

  it("renders the registration form", () => {
    render(<RegisterPage />)

    expect(screen.getByText("Create an account")).toBeInTheDocument()
    expect(screen.getByLabelText("First name")).toBeInTheDocument()
    expect(screen.getByLabelText("Last name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByLabelText("Role")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument()
    expect(screen.getByText("Already have an account?")).toBeInTheDocument()
    expect(screen.getByText("Sign in")).toBeInTheDocument()
  })

  it("handles form submission with valid data", async () => {
    mockCreateUser.mockResolvedValue({ user: { id: "test-id" } })

    render(<RegisterPage />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText("First name"), {
      target: { value: "John" },
    })
    fireEvent.change(screen.getByLabelText("Last name"), {
      target: { value: "Doe" },
    })
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john.doe@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Create account" }))

    // Check if createUser was called with the correct arguments
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "DEVELOPER",
      })
    })

    // Check if toast was called with success message
    expect(mockToast).toHaveBeenCalledWith({
      title: "Account created",
      description: "Your account has been created successfully. You can now log in.",
    })

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/login")
  })

  it("displays an error message when registration fails", async () => {
    mockCreateUser.mockResolvedValue({ error: "Email already exists" })

    render(<RegisterPage />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText("First name"), {
      target: { value: "John" },
    })
    fireEvent.change(screen.getByLabelText("Last name"), {
      target: { value: "Doe" },
    })
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "existing@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Create account" }))

    // Check if createUser was called
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalled()
    })

    // Check if toast was called with error message
    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Email already exists",
      variant: "destructive",
    })

    // Router should not be called on error
    expect(mockPush).not.toHaveBeenCalled()
  })
})
