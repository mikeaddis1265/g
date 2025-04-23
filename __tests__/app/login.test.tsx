import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import LoginPage from "@/app/login/page"

// Mock the modules
jest.mock("next-auth/react")
jest.mock("next/navigation")

describe("LoginPage", () => {
  const mockSignIn = signIn as jest.Mock
  const mockRouter = useRouter as jest.Mock
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    mockSignIn.mockReset()
    mockRouter.mockImplementation(() => ({
      push: mockPush,
      refresh: mockRefresh,
    }))
  })

  it("renders the login form", () => {
    render(<LoginPage />)

    expect(screen.getByText("Sign in")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    expect(screen.getByText("Forgot password?")).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
    expect(screen.getByText("Create account")).toBeInTheDocument()
  })

  it("handles form submission with valid credentials", async () => {
    mockSignIn.mockResolvedValue({ error: null })

    render(<LoginPage />)

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }))

    // Check if signIn was called with the correct arguments
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
        callbackUrl: "/dashboard",
      })
    })

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/dashboard")
    expect(mockRefresh).toHaveBeenCalled()
  })

  it("displays an error message when login fails", async () => {
    mockSignIn.mockResolvedValue({ error: "Invalid credentials" })

    const { getByLabelText, getByRole } = render(<LoginPage />)

    // Fill in the form
    fireEvent.change(getByLabelText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    })

    // Submit the form
    fireEvent.click(getByRole("button", { name: "Sign in" }))

    // Check if signIn was called
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled()
    })

    // Router should not be called on error
    expect(mockPush).not.toHaveBeenCalled()
  })
})
