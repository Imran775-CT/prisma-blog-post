# Prisma Blog App 🚀

A modern, high-performance blog application backend built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**. Featuring robust authentication, nested commenting systems, and advanced pagination/sorting capabilities.

---

## ✨ Features

- 🔐 **Secure Authentication**: Integrated with [Better-Auth](https://better-auth.com/) for seamless user management.
- 📝 **Post Management**: Full CRUD operations for blog posts with support for featured posts, tags, and view counting.
- 💬 **Nested Comments**: A recursive commenting system allowing for threaded replies.
- 📊 **Dynamic Pagination**: Custom helpers for efficient data fetching with sorting and filtering.
- 🛠 **Type-Safe**: Fully written in TypeScript with Prisma-generated types for database safety.
- 🗄 **PostgreSQL**: Powered by PostgreSQL for reliable data storage.

---

## 🛠 Tech Stack

- **Backend**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Auth**: [Better-Auth](https://better-auth.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Runtime**: [Node.js](https://nodejs.org/) with [tsx](https://tsx.is/) for development.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd prisma-blog-app
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your configuration:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"
   BETTER_AUTH_SECRET="your-secret-here"
   # Add other necessary environment variables
   ```

4. **Database Migration**:

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Running the App

- **Development Mode**:

  ```bash
  npm run dev
  ```

- **Seed Admin User**:
  ```bash
  npm run seed:admin
  ```

---

## 📂 Project Structure

```text
src/
├── helpers/       # Utility functions (Pagination, Sorting)
├── lib/           # Library configurations (Prisma, Auth)
├── middlewares/   # Express middlewares (Auth, Error handling)
├── modules/       # Feature modules (Posts, etc.)
├── scripts/       # Maintenance and seeding scripts
├── app.ts         # Express app configuration
└── server.ts      # Server entry point
```

---

## 📜 API Highlights

- **Posts**: `GET /api/posts`, `POST /api/posts`, etc.
- **Auth**: Managed via Better-Auth endpoints.
- **Pagination**: Supports Query Params `page`, `limit`, `sortBy`, and `sortOrder`.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the **ISC License**.
