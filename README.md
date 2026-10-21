# Qstream AI — Personalized AI Learning, Quiz, Revision & Skill Development Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38BDF8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Qstream AI** is an enterprise-grade, full-stack microlearning platform combining personalized curriculum paths, dynamic AI-generated assessments, SuperMemo-2 spaced repetition revision queues, context-aware AI tutoring, and cryptographically verifiable specialization certificates.

---

## 🌟 Key Features

1. **27 Production-Ready Learning Paths**: Covering Full Stack, MERN, Python, DSA, Java Placement, Generative AI, Cloud, AWS, DevOps, Docker & Kubernetes, System Design, and Soft Skills.
2. **108 Micro-Modules & 54+ Detailed 12-Section Notes**: Structured engineering notes featuring syntax, production examples, common anti-patterns, senior interview questions, and quick revision takeaways.
3. **Dynamic AI Quiz Generation**: Server-side OpenAI API integration (`gpt-4o-mini`) with schema validation, retry mechanism, 540-question internal fallback bank, and SHA-256 deduplication hashing.
4. **Adaptive Difficulty & Skill-Gap Analysis**: Calibrates questions to user retention curves (0–40% Easy, 40–70% Medium, 70–85% Hard, 85–100% Advanced).
5. **SuperMemo-2 Spaced Repetition**: Intelligent daily review queues (`/api/revision/today`) targeting weak subtopics right before memory decay occurs.
6. **24/7 Contextual AI Tutor**: Mentors learners directly on code snippets, explains architectural tradeoffs, and conducts on-demand mini-quizzes without exposing API keys.
7. **Verifiable Certificates of Mastery**: Tamper-proof credentials issued upon 100% path completion, featuring unique verification IDs (`QSTRM-2026-XXXX`) and public verification URLs (`/verify/:certificateId`).
8. **Interactive Recharts Analytics**: Weekly accuracy trends, daily study time, mastery radar vs industry benchmarks, and topic performance gauges.
9. **Global Leaderboard & Notifications**: Gamified XP rankings, learning streak tracking, and automated revision reminder alerts.
10. **Zero Broken Routes & Strict Validation**: Guaranteed prevention of `/quiz/undefined` or invalid identifiers with HTTP 400 guards.

---
## 🏗️ Architecture & Technology Stack
```
                                  +---------------------------------------+
                                  |     React + Vite Single Page App      |
                                  |   (Tailwind CSS, Lucide, Recharts)    |
                                  +-------------------+-------------------+
                                                      |
                                     HTTPS REST / JWT | Bearer
                                                      v
+------------------------+        +-------------------+-------------------+        +------------------------+
|      OpenAI API        |<------>|     Express.js REST API Server        |<------>|  Redis Cache (Optional)|
|   (Server-Side Only)   |        |   (Helmet, Rate-Limit, Zod Guards)    |        | (Memory Store Fallback)|
+------------------------+        +-------------------+-------------------+        +------------------------+
                                                      |
                                     Supabase Admin   | Connection
                                                      v
                                  +-------------------+-------------------+
                                  |     Supabase PostgreSQL (Cloud)       |
                                  |  - 12 Core Tables, RLS, UUIDs, Triggers|
                                  |  - Supabase Auth (JWT Provider)       |
                                  +---------------------------------------+
```

* **Frontend**: React 18, Vite 6, Tailwind CSS, Recharts, React Router DOM v6, Axios, Supabase Client.
* **Backend**: Node.js, Express.js, Helmet, CORS, Morgan, Express-Rate-Limit, Zod, UUID, Crypto.
* **Database & Auth**: Supabase PostgreSQL (Managed Cloud), Row Level Security (RLS), Supabase Auth.
* **AI Engine**: OpenAI API (`gpt-4o-mini`) with the automatic fallback to pre-seeded 540-question bank and heuristic tutor.
* **DevOps**: Docker, Docker Compose, Kubernetes manifests (`k8s/`).

---

## 📂 Project Structure

```
qstream-ai/
├── client/                     # Vite React Frontend SPA
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Sidebar, Cards, QuizUI, Charts, AIChat, Modal)
│   │   ├── contexts/           # Global AuthContext, NotificationContext, ToastContext
│   │   ├── layouts/            # AppLayout (Sidebar+Navbar), AuthLayout
│   │   ├── pages/              # 20 Dedicated Application Pages (Dashboard, Paths, Quiz, Notes, etc.)
│   │   ├── services/           # Axios API client, Supabase browser client
│   │   ├── App.jsx             # Main router tree
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind design tokens & dark theme styles
│   └── package.json
│
├── server/                     # Node.js / Express REST API
│   ├── src/
│   │   ├── config/             # Supabase, OpenAI, and Redis clients
│   │   ├── controllers/        # REST route controllers (Auth, Quizzes, Paths, Analytics, etc.)
│   │   ├── middleware/         # Auth verify, UUID validation, Rate-limiting, Central error handler
│   │   ├── routes/             # Modular Express routers
│   │   ├── services/           # AI Quiz engine, Spaced Repetition, Adaptive engine, Certificates
│   │   ├── utils/              # Response formatter, SHA-256 hash util, parameter validator
│   │   ├── data/               # Seed generator, curriculum dataset (27 paths, 108 modules)
│   │   └── server.js           # Server bootstrap & middleware chain
│   ├── scripts/                # Database seed runner (seed.js)
│   ├── tests/                  # Automated API test suite
│   └── package.json
│
├── supabase/                   # Database Migrations & Schemas
│   ├── migrations/
│   │   ├── 001_initial_schema.sql      # 12 core PostgreSQL tables with constraints
│   │   ├── 002_rls_policies.sql        # Row Level Security data isolation
│   │   ├── 003_functions_triggers.sql  # Auto-profile creation on auth signup
│   │   └── 004_indexes.sql             # High-performance B-Tree indexes
│   ├── seed.sql                # Complete SQL seed (27 paths, 108 modules, 540 questions)
│   └── config.toml             # Supabase project configuration
│
├── k8s/                        # Kubernetes Deployments & Services
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.example.yaml
│   ├── server-deployment.yaml
│   ├── client-deployment.yaml
│   └── ...
│
├── Dockerfile.client           # Multi-stage production Nginx container
├── Dockerfile.server           # Hardened Node.js production container
├── docker-compose.yml          # Container orchestration (client, server, redis)
├── .env.example                # Canonical environment variable specification
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+ installed (`node -v`)
- npm 9+ installed (`npm -v`)
- Git installed (`git --version`)

### 2. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-org/qstream-ai.git
cd "qstream-ai"

# Install root, backend and frontend dependencies in one step:
npm run install:all
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```

Set your configuration values:
```env
# Client & Server
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development

# Supabase Credentials (Project Ref: hataawyodibdnnjolvqc)
# Dashboard: https://supabase.com/dashboard/project/hataawyodibdnnjolvqc
SUPABASE_URL=https://hataawyodibdnnjolvqc.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI (Optional - platform uses rich internal question bank if omitted)
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o-mini
```

### 4. Supabase Database Setup & Seeding

#### Option A: Automatic Seed via Script
If your `.env` contains `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`:
```bash
npm run seed
```

#### Option B: Supabase SQL Editor (Instant)
1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/hataawyodibdnnjolvqc/sql/new](https://supabase.com/dashboard/project/hataawyodibdnnjolvqc/sql/new)
2. Execute the migrations in order:
   - Run `supabase/migrations/001_initial_schema.sql`
   - Run `supabase/migrations/002_rls_policies.sql`
   - Run `supabase/migrations/003_functions_triggers.sql`
   - Run `supabase/migrations/004_indexes.sql`
   - Run `supabase/seed.sql`

*(Note: The platform features an intelligent local fallback mode so you can run and test all UI and API features immediately even before connecting cloud keys!)*

### 5. Start the Development Servers
Run both backend Express server (port 5000) and frontend Vite client (port 5173) concurrently:
```bash
npm run dev
```

* **Frontend App**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)
* **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Testing

Run the automated backend test suite (testing health, paths, modules, notes, quiz generation, leaderboard, and token verification):
```bash
npm test
```

All 9 integration tests will execute against live routes.

---

## 🐳 Docker Deployment

To build and run the entire stack (Frontend Nginx SPA, Backend Express API, and Redis) with Docker Compose:

```bash
docker-compose up --build -d
```

* Frontend: `http://localhost`
* Backend API: `http://localhost:5000`
* Redis: `localhost:6379`

To stop:
```bash
docker-compose down
```

---

## ☸️ Kubernetes Deployment

Deploy Qstream AI to any standard Kubernetes cluster (EKS, GKE, AKS, or Minikube):

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Configure secrets & configmap
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.example.yaml

# 3. Deploy server & client workloads
kubectl apply -f k8s/server-deployment.yaml
kubectl apply -f k8s/client-deployment.yaml

# 4. Verify deployment status
kubectl get pods -n qstream-ai
kubectl get svc -n qstream-ai
```

---

## 🔒 Security Best Practices

1. **Service Role Isolation**: `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to the backend environment and is never exposed in client bundles.
2. **Row Level Security (RLS)**: PostgreSQL tables enforce user isolation policies based on `auth.uid() = user_id`.
3. **HTTP Hardening**: Helmet sets security headers (`X-Frame-Options`, `Content-Security-Policy`, `HSTS`).
4. **Rate Limiting**: Express-rate-limit prevents brute force attacks on authentication and AI generation endpoints.
5. **Sanitization & Input Validation**: Validates UUIDs, checks undefined parameters, and blocks SQL/NoSQL injection patterns.
6. **Hidden Answer Keys**: Correct quiz answers are never sent to the browser during active quiz attempts.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
