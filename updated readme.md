# 🧠 Support-Agent  
### Multi-Agent AI Support System with LLM Routing, Tool Calling & Contextual Memory

A production-style **agentic AI backend** demonstrating **LLM-based routing**, **specialized sub-agents**, **database-backed tool calling**, and **conversation memory**, built as part of an **Applied AI / Research Internship assessment**.

---

## 📌 Project Summary

This project implements a **multi-agent AI support system** capable of handling real-world customer support scenarios such as:

- General support & FAQs
- Order tracking and delivery queries
- Billing, payments, refunds, and invoices

Instead of brittle keyword matching, the system uses a **main LLM router agent** that intelligently decides **which sub-agent should handle a query**, and each sub-agent can **call tools that query real database data**.

All conversations are **persisted**, **context-aware**, and **user-scoped**.

---

## ✨ Core Features

### ✅ Agentic AI Architecture
- LLM-based **Router Agent**
- Specialized **Support, Order, and Billing agents**
- Tool calling from sub-agents
- Agent handoff when scope changes

### ✅ Contextual Conversations
- Conversation memory stored in DB
- Resolves references like *“it”*, *“that order”*, *“as I said before”*
- Session-based conversations (new session per browser / restart)

### ✅ Real Database Tools
- Prisma + PostgreSQL
- Orders, payments, conversations seeded with real data
- Agents query DB via tools (no hallucination)

### ✅ REST API + Frontend Demo
- Clean REST endpoints
- React frontend for easy testing
- No authentication complexity (as per assessment scope)

---

## 🧠 Agent Architecture

<img src="images/architecture.png" width="900" />

### 🔹 Main Router Agent (LLM-Based)
- Reads:
  - User message
  - Recent conversation history
- Decides:
  - Which sub-agent should handle the request
- Can redirect back to support if query goes out of scope

### 🔹 Sub-Agents (All Implemented)

#### 1️⃣ Support Agent
**Responsibilities**
- General support
- Clarifications
- FAQs
- Context resolution

**Tools**
- Query conversation history

---

#### 2️⃣ Order Agent
**Responsibilities**
- Order status
- Shipment & delivery
- Order follow-ups

**Tools**
- Fetch latest order by user
- Check delivery status

---

#### 3️⃣ Billing Agent
**Responsibilities**
- Payment status
- Refund status
- Invoice queries

**Tools**
- Fetch payments by user
- Check refund status

---

## 🧰 Tech Stack

### Backend
- Node.js
- Hono (lightweight web framework)
- Prisma ORM
- PostgreSQL
- Vercel AI SDK
- Groq LLM (LLaMA-3.1-8B-Instant)

### Frontend
- React
- Vite
- HTML / CSS

### Tooling & Utilities
- TypeScript
- tsx
- Vitest
- Prisma Studio
- CSV-based data seeding

---

## 🗃️ Database Design (Prisma)

Entities:
- `User`
- `Conversation`
- `Message`
- `Order`
- `Payment`

All messages and agent replies are stored to support:
- Conversation replay
- Contextual reasoning
- RBAC via `userId`

---

## 🌐 API Endpoints

### Health
GET /api/health
---
### Chat
POST /api/chat/messages # Send a message
GET /api/chat/conversations?userId=1
GET /api/chat/conversations/:id
DELETE /api/chat/conversations/:id?userId=1
---
### Agents
GET /api/agents
GET /api/agents/:type/capabilities

---

## 📁 Project Structure

support-agent/
├── apps/
│   ├── backend/                 # Hono + Agents + Prisma
│   │   ├── prisma/
│   │   ├── src/
│   │   │   ├── agents/
│   │   │   ├── tools/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── middlewares/
│   │   │   ├── db/
│   │   │   └── app.ts
│   │   ├── .env
│   │   └── package.json
│   │
│   └── web/                     # React + Vite frontend
│       ├── src/
│       ├── index.html
│       └── package.json
│
├── packages/                    # (Reserved for shared types / RPC)
│
├── turbo.json
├── package.json                 # Root workspace config
└── README.md

---

## 🧩 Monorepo Architecture (Turborepo)

This project is structured as a **Turborepo monorepo** to support:

- Clear separation of frontend and backend apps
- Shared packages (types, API contracts) without duplication
- Scalable architecture for future expansion (Hono RPC)

### Apps
- `apps/backend` → Hono-based AI backend
- `apps/web` → React + Vite frontend

### Packages
- `packages/` → Reserved for shared types and API contracts (introduced in later phases)

All applications are orchestrated using Turborepo for unified development and build workflows.

---

## 🔧 Environment Variables

### Backend (`apps/backend/.env`)

```env
DATABASE_URL="postgresql://postgres@localhost:5432/support_agent"
GROQ_API_KEY=your_groq_api_key_here
PRISMA_CLIENT_ENGINE_TYPE=binary
PRISMA_CLI_QUERY_ENGINE_TYPE=binary

NOTE - Authentication is intentionally omitted to keep focus on agent logic (as per assessment).

---

# ▶️ Running the Project (Monorepo Setup)

This project uses a Turborepo monorepo, so both the backend and frontend are managed and run from the repository root.

## 1️⃣ Clone Repository
git clone https://github.com/Anugrah0619/Support-agent.git
cd Support-agent

## 2️⃣ Install Dependencies (Root)
npm install

This installs dependencies for:
Backend (apps/backend)
Frontend (apps/web)
Workspace tooling

## 3️⃣ Configure Backend Environment

Create the environment file: apps/backend/.env

DATABASE_URL="postgresql://postgres@localhost:5432/support_agent"
GROQ_API_KEY=your_groq_api_key_here
PRISMA_CLIENT_ENGINE_TYPE=binary
PRISMA_CLI_QUERY_ENGINE_TYPE=binary

Environment variables are explicitly loaded at runtime to support Node ESM and monorepo execution.

## 4️⃣ Setup Database (Prisma)
cd apps/backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio (Optional)

## 5️⃣ Seed Database with Sample Data
npx tsx scripts/seedFromCsv.ts

## 6️⃣ Start Full System (Backend + Frontend)

Return to the repository root:
cd ../../
npm run dev

This command:
Starts the backend on http://localhost:3000
Starts the frontend on http://localhost:5173
Uses Turborepo to orchestrate both applications

## 7️⃣ Access the Application

Frontend UI: http://localhost:5173
Backend Health Check: http://localhost:3000/api/health

✅ Notes

Backend and frontend are not run separately
Turborepo ensures consistent dev and build workflows
Authentication is intentionally omitted to focus on agent logic (as per assessment scope)
---

# 🧪 How to Test (Recommended Order)

## 1️⃣ Basic Support

Hi
Can you help me?

---

## 2️⃣ Order Flow

Where is my order?
Is it shipped?
When will it be delivered?

---

## 3️⃣ Billing Flow

What is my payment status?
Do I have any refund?

---

## 4️⃣ Agent Switching (Key Test)

Where is my order?
What is my payment status?
Is it shipped?

---

## 5️⃣ Context Resolution

Is it shipped?
When will it be delivered?

---

# 🧠 Design Decisions

- LLM-based routing avoids brittle keyword-based logic  
- Sub-agents remain focused, modular, and independently testable  
- Tools guarantee factual, database-backed responses  
- Conversation memory enables real multi-turn conversational behavior  
- RBAC enforced using `userId` without introducing authentication complexity  
- Architecture closely mirrors real-world agentic AI systems used in production  

---
