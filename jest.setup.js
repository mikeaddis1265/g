// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "",
}))

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        role: "developer",
      },
    },
    status: "authenticated",
  })),
}))

// Mock hooks
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }),
)
