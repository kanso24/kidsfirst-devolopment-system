# Child Development Assessment Admin System

A modern, clean admin dashboard built with Nuxt 3, Nuxt UI, Tailwind CSS, and Prisma (PostgreSQL).

## Features
- **User Management**: Create, Read, Update, Delete users with admin/staff roles.
- **Student Management**: Manage student profiles and records.
- **Reports & Dashboard**: Summary cards, recent activity, and table reports.
- **PDF Export**: Export users and students data to beautifully formatted PDF reports.
- **Authentication**: JWT-based authentication with role-based access control.

## Tech Stack
- Frontend Framework: [Nuxt 3](https://nuxt.com/)
- UI Component Library: [Nuxt UI](https://ui.nuxt.com/) (Violet Theme)
- CSS Framework: [Tailwind CSS](https://tailwindcss.com/)
- Database ORM: [Prisma](https://www.prisma.io/) v6
- Database: PostgreSQL (Supabase)
- Authentication: `jsonwebtoken` & `bcryptjs`
- PDF Generation: `jspdf` & `jspdf-autotable`

## Prerequisites
- Node.js (v18+)
- PostgreSQL Database

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (if not already created) and add your database connection string and a random JWT secret:
```env
DATABASE_URL="postgresql://postgres:xxxxxxx@db.xxxxxxxxxx.supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-key-change-in-production"
```

### 3. Setup Database
Run the following commands to configure your database schema and create the initial admin account:

Generate Prisma Client:
```bash
npm run prisma:generate
```

Push the database schema (or use migrations):
```bash
npx prisma db push
# OR
npm run prisma:migrate
```

Seed the database with the default admin account:
```bash
npm run prisma:seed
```
*Note: The default admin account is `username: admin`, `password: password123`*

### 4. Run Development Server
Start the application locally:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## How to use the Reports Page & PDF Export
1. Navigate to the **Reports** section using the sidebar.
2. Admins will see both **Students Report** and **Users Report** tabs. Staff will only see the Students Report.
3. Click the **Export as PDF** button in the top right corner.
4. A PDF file named `students-report-YYYY-MM-DD.pdf` (or users) will be automatically downloaded to your device, featuring a clean Violet-themed grid layout.

## Project Structure
- `server/api/`: Nitro API routes for authentication, users, students, and reports.
- `pages/`: Vue frontend pages (dashboard, login, users list, etc.).
- `components/`: Reusable Vue components (AppSidebar, AppHeader).
- `layouts/`: Nuxt layouts (default, auth).
- `composables/`: Shared frontend utilities (useAuth, usePdfExport).
- `prisma/`: Prisma schema and seed script.
