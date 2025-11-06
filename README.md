# Sobo - Social Media Boards

A web application for creating and sharing boards with social media posts. Replace cluttered group chats with organized, collaborative boards.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start/latest) with TypeScript
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [TanStack Router](https://tanstack.com/router/latest)
- **API**: [tRPC](https://trpc.io/)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your PostgreSQL database URL.

4. Generate Prisma client and run migrations:
   ```bash
   bun run db:generate
   bun run db:migrate
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier
- `bun run test` - Run tests with Vitest
- `bun run db:generate` - Generate Prisma client
- `bun run db:push` - Push schema changes to database
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Prisma Studio

## Project Structure

```
sobo/
├── app/
│   ├── components/      # Reusable React components
│   ├── routes/          # TanStack Router routes
│   ├── server/          # Server-side code and tRPC routers
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── client.tsx       # Client entry point
│   └── ssr.tsx          # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
└── app.config.ts        # TanStack Start configuration
```

## Features (Planned)

- Create and manage boards
- Pin social media posts to boards
- Share boards with others
- Collaborative editing
- Support for multiple social media platforms

## License

MIT
