# Finances Backend

A clean, scalable backend starter project for an analytics app built with Node.js, TypeScript, Express, and Prisma.

## Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database

## Project Structure

```
backend/
 ├─ src/
 │   ├─ app.ts                      // Express instance + middleware
 │   ├─ server.ts                   // Server bootstrap
 │   ├─ config/
 │   │   ├─ env.ts                  // Environment variables
 │   │   └─ db.ts                   // Prisma client connection
 │   ├─ modules/
 │   │   ├─ operation/
 │   │   │   ├─ operation.model.ts  // Model logic
 │   │   │   ├─ operation.router.ts // Routes
 │   │   │   └─ operation.service.ts// Business logic
 │   │   └─ team/
 │   │       ├─ team.model.ts
 │   │       ├─ team.router.ts
 │   │       └─ team.service.ts
 │   ├─ routes/
 │   │   └─ index.ts                // Route registration
 │   ├─ utils/
 │   │   ├─ errorHandler.ts         // Error middleware
 │   │   └─ response.ts             // Response helpers
 │   └─ types/
 │       └─ index.d.ts              // Type definitions
 ├─ prisma/
 │   └─ schema.prisma               // Database schema
 ├─ package.json
 ├─ tsconfig.json
 ├─ .env.example
 └─ README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update `POSTGRES_URL` with your database credentials.

4. Generate Prisma Client:
   ```bash
   npm run prisma:generate
   ```

5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

### Development

Run the development server with hot reload:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Architecture

The project follows a modular architecture where each feature is organized in its own module with:
- **Model** - Data models and Prisma queries
- **Router** - Express route definitions
- **Service** - Business logic layer

This structure promotes scalability and maintainability.

## License

ISC

