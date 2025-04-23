# Bug Tracker

A comprehensive bug tracking system for software development teams.

## Features

- User management with role-based permissions
- Project management
- Bug reporting and tracking
- Dashboard with metrics and reporting
- Activity logs and notifications
- Search and filtering capabilities

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- NextAuth.js for authentication
- Supabase for database
- Jest for testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or Supabase)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/bug_tracker"
POSTGRES_URL="postgresql://postgres:password@localhost:5432/bug_tracker"
POSTGRES_PRISMA_URL="postgresql://postgres:password@localhost:5432/bug_tracker"
POSTGRES_URL_NON_POOLING="postgresql://postgres:password@localhost:5432/bug_tracker"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="password"
POSTGRES_HOST="localhost"
POSTGRES_DATABASE="bug_tracker"

# Supabase
SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
SUPABASE_JWT_SECRET="your-supabase-jwt-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
\`\`\`

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up the database:
   \`\`\`bash
   npm run setup-db
   \`\`\`
4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing

Run the tests:
\`\`\`bash
npm test
\`\`\`

Run tests with coverage:
\`\`\`bash
npm run test:coverage
\`\`\`

## Deployment

The application can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Configure the environment variables
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
