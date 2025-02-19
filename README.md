# Menu Management System

This is a Menu Management System built with Next.js, Prisma, Redux, and Tailwind CSS.

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL database

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/zakiamansyah/menu-management-system.git
cd menu-management-system
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up the database

Create a `.env` file in the root directory and add your PostgreSQL database URL:

```
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
```

### 4. Run database migrations

```sh
npx prisma migrate dev --name init
```

### 5. Generate Prisma Client

```sh
npx prisma generate
```

### 6. Start the development server

```sh
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `settings.json`: VSCode settings.
- `next-env.d.ts`: Next.js environment types.
- `package.json`: Project dependencies and scripts.
- `postcss.config.js`: PostCSS configuration.
- `schema.prisma`: Prisma schema for the database.
- `route.ts`: API routes for managing menus.
- `route.ts`: API routes for managing individual menu items.
- `globals.css`: Global CSS styles.
- `layout.tsx`: Root layout component.
- `page.tsx`: Home page component.
- `providers.tsx`: Redux provider component.
- `MenuForm.tsx`: Menu form component.
- `MenuList.tsx`: Menu list component.
- `Sidebar.tsx`: Sidebar component.
- `menuSlice.ts`: Redux slice for menus.
- `store.ts`: Redux store configuration.
- `tailwind.config.js`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.