<img width="1376" height="768" alt="621232317-096010b5-99f3-4180-8bb3-0195cd883e4f" src="https://github.com/user-attachments/assets/5775a383-240e-47ce-9d68-8eff75d92708" />

# Enterprise Node.js Clean Architecture Boilerplate

A production-ready, highly scalable Express.js and TypeScript backend boilerplate using SOLID principles, Clean Architecture, Prisma ORM, and Neon PostgreSQL.


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Migrations & Seeding](#database-migrations--seeding)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Docker Support](#docker-support)
- [Aesthetics & Quality](#aesthetics--quality)

---

## Features

- **Clean Architecture & SOLID**: strict separation of concerns (Routes → Controllers → Services → Repositories → DB).
- **Authentication**: JWT access and refresh tokens, secure `httpOnly` cookie storage, bcrypt password hashing, verify email flow, password resets.
- **Role-Based Authorization**: permissions middleware for Roles: `USER`, `MANAGER`, `ADMIN`, `SUPER_ADMIN`.
- **Validation**: strict Request schemas using Zod for Body, Query, Path Parameters.
- **Robust Logger**: Winston configured for console, error, combined, and HTTP logs.
- **Robust Error Handling**: global middleware capturing operational, validation, JWT, and database query exceptions.
- **Cloudinary Integration**: Multer file stream upload, file filter, and automated size validation.
- **Quality Assurance**: pre-configured ESLint, Prettier, Husky, and lint-staged.
- **Testing ready**: Jest & Supertest configurations built-in.

---

## Tech Stack

- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: Neon (Serverless PostgreSQL) & Prisma ORM
- **Security**: Helmet, CORS, Express Rate Limiter, secure cookies
- **Hashing & Tokens**: bcryptjs, jsonwebtoken (JWT)
- **Files**: Cloudinary, Multer
- **Validation**: Zod
- **Documentation**: Swagger UI & OpenAPI Specification

---

## Folder Structure

```
src/
├── app.ts                  # App configuration & middleware loading
├── server.ts               # Server bootstrap & graceful shutdown hooks
├── config/                 # SDK config (db, logger, cloudinary, env)
├── middleware/             # Middlewares (auth, error, rate-limit, validation)
├── modules/                # Core domain modules
│   ├── auth/               # Register, login, forgot password, token refreshes
│   ├── users/              # User profiles & management
│   ├── uploads/            # Cloudinary asset uploads
│   ├── products/           # Catalog entries
│   ├── orders/             # Checkout cart tracking
│   ├── categories/         # Product groupings
│   └── common/             # Shareable types
├── utils/                  # Core helpers (ApiError, ApiResponse, pagination, token, hash)
├── docs/                   # Swagger configuration
└── prisma/                 # Database schema & seeding
```

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database (or Neon account)
- Cloudinary account credentials

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Update the credentials inside `.env`.

### Environment Variables

| Variable Name | Description | Default / Example |
|---|---|---|
| `PORT` | Port server runs on | `5000` |
| `NODE_ENV` | Mode of operation | `development` |
| `CLIENT_URL` | URL of frontend client | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Token secret key | `super_secret_access_key` |
| `JWT_REFRESH_SECRET` | Token refresh secret key | `super_secret_refresh_key` |
| `CLOUDINARY_NAME` | Cloudinary Cloud Name | `your_cloud_name` |
| `CLOUDINARY_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_SECRET` | Cloudinary API Secret | `your_api_secret` |

### Database Migrations & Seeding

Sync your schema with database and run default seeds (creates category records and a super-admin user):

```bash
# Generate Prisma Client
npm run prisma:generate

# Run DB Migrations
npm run prisma:migrate

# Seed DB with initial parameters
npm run seed
```

---

## API Documentation

The project auto-generates Swagger documentation. Once the server is running, navigate to:

```
http://localhost:5000/api-docs
```

To test protected routes, click "Authorize" and input a JWT token.

---

## Available Scripts

- `npm run dev`: start development server using `ts-node-dev`.
- `npm run build`: compile TypeScript into Javascript in `/dist`.
- `npm run start`: run compiled production server.
- `npm run lint`: run ESLint checks.
- `npm run format`: format project files with Prettier.
- `npm run test`: run integration tests using Jest.
- `npm run seed`: seed database.

---

## Docker Support

### Running local environment

To build and spin up the complete package including a local PostgreSQL instance:

```bash
docker-compose up --build
```
