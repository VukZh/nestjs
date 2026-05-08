# NestJS + React CI/CD Monorepo

This project demonstrates a full-cycle production setup for a NestJS and React monorepo using Docker, GitHub Actions, and Render.com.

## 🚀 Live Demo

- **Frontend**: [https://nestjs-frontend-latest.onrender.com](https://nestjs-frontend-latest.onrender.com)
- **Backend API**: [https://nestjs-backend-latest-3lqm.onrender.com/api](https://nestjs-backend-latest-3lqm.onrender.com/api)

## 🛠 Tech Stack

- **Backend**: NestJS, Prisma ORM, PostgreSQL.
- **Frontend**: React (Vite), Mantine UI, Nginx (for production serving).
- **Infrastructure**: Docker, Docker Compose (Local Validation), GitHub Actions (CI/CD), GitHub Container Registry (GHCR), Render.com.

---

## 💻 Local Validation (Docker Compose)

Before deploying to the cloud, the entire stack was validated locally using Docker Compose. This ensures that the multi-container architecture (DB + API + UI) works seamlessly.

To verify the setup on your machine:

```bash
git clone https://github.com/vukzh/nestjs.git
cd nestjs
docker-compose up --build
```

- **Frontend**: `http://localhost:80`
- **Backend API**: `http://localhost:3000`
- **Swagger Docs**: `http://localhost:3000/api`

---

## ⛓ CI/CD Pipeline

The project uses a fully automated pipeline defined in `.github/workflows/main.yaml`:

1. **Validate**: Runs ESLint (Frontend & Backend) and Unit Tests.
2. **Build & Push**:
   - Builds optimized Docker images for both services.
   - For Frontend, the `VITE_API_URL` is injected during the build stage.
   - Pushes images to **GitHub Container Registry (GHCR)**.

---

## ☁️ Deployment Guide (Render.com)

To replicate this deployment, follow these steps in order:

### Step 1: Database (PostgreSQL)

1. Create a new **PostgreSQL** instance on Render.
2. Note the **Internal Database URL** for Step 2.

### Step 2: Backend Service (Deploy First)

1. Create a new **Web Service**.
2. Select **"Deploy an existing image from a registry"**.
3. Image URL: `ghcr.io/vukzh/nestjs-backend:latest` (ensure the package is **Public** on GitHub).
4. Add the following **Environment Variables**:
   - `DATABASE_URL`: Your Internal Database URL from Step 1.
   - `AUTH_SECRET`: A secret string for JWT signing.
   - `PORT`: `3000`
   - `FE_URL`: `https://nestjs-frontend-latest.onrender.com` (your frontend URL).

### Step 3: Frontend Service

1. On GitHub, go to **Settings -> Secrets and variables -> Actions -> Variables**.
2. Add a variable `VITE_API_URL` with your **Backend URL** (e.g., `https://nestjs-backend-latest-3lqm.onrender.com`).
3. Push code to the `CICD` branch to trigger a new build with this variable "baked in".
4. On Render, create a new **Web Service**.
5. Image URL: `ghcr.io/vukzh/nestjs-frontend:latest`.

---

## 🏗 Implementation Details

### Docker Optimization

- **Multi-stage builds**: Reduces image size by separating the build environment from the runtime.
- **Monorepo Handling**: Build context is set to the root to allow cross-package type imports.
- **Security**: Backend runs as a non-root user (`nestjs`) for production safety.
- **Nginx**: Frontend uses Nginx with a custom config to handle SPA routing (`try_files`).

### Prisma 7 Configuration

- Uses `prisma.config.ts` for environment-agnostic configuration.
- Automatically runs `prisma migrate deploy` on backend startup.
