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
- Prisma ORM
- PostgreSQL database
- Jest for testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
# Database
DATABASE_URL="postgresql://postgres:19948miko@localhost:5432/bug_tracker"
NEXTAUTH_SECRET="1234567890"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Generate Prisma client:
   \`\`\`bash
   npx prisma generate
   \`\`\`
4. Push the schema to the database:
   \`\`\`bash
   npx prisma db push
   \`\`\`
5. Seed the database:
   \`\`\`bash
   npm run db:seed
   \`\`\`
6. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing

Run the tests:
\`\`\`bash
npm test
\`\`\`

Run tests with coverage:
\`\`\`bash
npm run test:coverage
\`\`\`

## Default Users

After seeding the database, you can log in with the following credentials:

- Admin User:
  - Email: admin@example.com
  - Password: admin123

- Developer User:
  - Email: dev@example.com
  - Password: dev123

## License

This project is licensed under the MIT License - see the LICENSE file for details.
