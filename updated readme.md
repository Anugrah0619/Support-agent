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
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── prisma.config.ts
│   │
│   ├── scripts/
│   │   └── seedFromCsv.ts
│   │
│   ├── src/
│   │   ├── agents/
│   │   │   ├── router.agent.ts        # LLM-based routing agent
│   │   │   ├── support.agent.ts       # Support sub-agent
│   │   │   ├── order.agent.ts         # Order sub-agent
│   │   │   └── billing.agent.ts       # Billing sub-agent
│   │   │
│   │   ├── tools/
│   │   │   ├── conversation.tool.ts   # Conversation history queries
│   │   │   ├── order.tool.ts          # Order-related DB queries
│   │   │   └── billing.tool.ts        # Payment & refund queries
│   │   │
│   │   ├── services/
│   │   │   └── chat.service.ts        # Core orchestration logic
│   │   │
│   │   ├── controllers/
│   │   │   └── chat.controller.ts     # HTTP request handlers
│   │   │
│   │   ├── routes/
│   │   │   ├── chat.routes.ts         # /api/chat routes
│   │   │   └── agent.routes.ts        # /api/agents routes
│   │   │
│   │   ├── middlewares/
│   │   │   └── error.middleware.ts    # Global error handler
│   │   │
│   │   ├── db/
│   │   │   └── prisma.ts              # Prisma client singleton
│   │   │
│   │   ├── app.ts                     # Hono app configuration
│   │   └── server.ts                  # Server bootstrap
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Chat UI
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── README.md

---

## 🔧 Environment Variables (`.env`)

```env
DATABASE_URL="postgresql://postgres@localhost:5432/support_agent"
GROQ_API_KEY=your_groq_api_key_here
PRISMA_CLIENT_ENGINE_TYPE=binary
PRISMA_CLI_QUERY_ENGINE_TYPE=binary

NOTE - Authentication is intentionally omitted to keep focus on agent logic (as per assessment).

---

## Backend Setup

# 1. Clone repository
git clone https://github.com/Anugrah0619/Support-agent.git
cd Support-agent/backend

# 2. Install dependencies
npm install

# 3. Create environment file
# backend/.env
DATABASE_URL="postgresql://postgres@localhost:5432/support_agent"
GROQ_API_KEY=your_groq_api_key

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. (Optional) Reset database completely
npx prisma migrate reset

# 7. Seed database with sample data
npx tsx scripts/seedFromCsv.ts

# 8. (Optional) Verify data
npx prisma studio

# 9. Start backend server
npx tsx --env-file .env src/server.ts

---

## Frontend setup 

# 1. Navigate to frontend
cd ../frontend

# 2. Install dependencies
npm install

# 3. Start frontend
npm run dev

frontend - http://localhost:5173

---

## 🧪 How to Test (Recommended Order)

### 1️⃣ Basic Support

Hi
Can you help me?

---

### 2️⃣ Order Flow

Where is my order?
Is it shipped?
When will it be delivered?

---

### 3️⃣ Billing Flow

What is my payment status?
Do I have any refund?

---

### 4️⃣ Agent Switching (Key Test)

Where is my order?
What is my payment status?
Is it shipped?

---

### 5️⃣ Context Resolution

Is it shipped?
When will it be delivered?

---

## 🧠 Design Decisions

- LLM-based routing avoids brittle keyword-based logic  
- Sub-agents remain focused, modular, and independently testable  
- Tools guarantee factual, database-backed responses  
- Conversation memory enables real multi-turn conversational behavior  
- RBAC enforced using `userId` without introducing authentication complexity  
- Architecture closely mirrors real-world agentic AI systems used in production  

---
