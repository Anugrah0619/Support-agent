# Support-agent (Backend Setup)

cd backend
npm init -y (initializes node project)

---------------------------------------------------------
npm install hono (nodejs backend framework)
npm install prisma @prisma/client (DB ORM)
npm install dotenv (environment variables)
---------------------------------------------------------
npx prisma init
---------------------------------------------------------

Backend  Project structure 

support-agent/
├── backend/
│   ├── node_modules/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── prisma.config.ts
│   ├── src/
│   │   ├── agents/
│   │   │   ├── billing.agent.ts
│   │   │   ├── order.agent.ts
│   │   │   ├── router.agent.ts
│   │   │   └── support.agent.ts
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tools/
│   │   │   ├── billing.tool.ts
│   │   │   ├── conversation.tool.ts
│   │   │   └── order.tool.ts
│   │   └── app.ts
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
├── README.md
├── requirements.txt   (we’ll discuss this)
└── myenv              (we’ll discuss this)

---------------------------------------------------------

Roadmap - 

0️⃣ Initial Backend Proj setup
1️⃣ Database design (Prisma schema)
2️⃣ Database connection (Prisma client)
3️⃣ Seed fake data
4️⃣ Basic server (app.ts) + health route
5️⃣ First API route (POST /chat/messages)
6️⃣ Router Agent logic
7️⃣ One sub-agent end-to-end (Support Agent)
8️⃣ Add Order + Billing agents
9️⃣ Conversation memory
🔟 Optional: streaming / frontend

-------------------------------------------------------

2️⃣ PostgreSQL & Prisma Setup-
- create DB in psql -   psql postgres
                        CREATE DATABASE support_agent;
                        \q

- in backend/.env, DB url -     DATABASE_URL="postgresql://postgres@localhost:5432/support_agent"
- Now run prisma migration -    cd backend
                                npx prisma migrate dev --name init

-------------------------------------------------------

3️⃣ Seed fake data
added seed data into prisma/seed.ts and updated package.json accordingly
do npm run seed = Seed data inserted successfully

-------------------------------------------------------

4️⃣ Basic server (app.ts) + health route
do - npm install @hono/node-server
Run - node src/app.ts 
in http://localhost:3000/health you can see - {"status":"ok","message":"Backend is running"}``

-------------------------------------------------------

5️⃣ First API route (POST /chat/messages)
do - node src/app.ts
use postman to check if success or not

---------------------------------------------------------

6️⃣ Router Agent logic
To start backend server always do node src/app.ts
after that check response in postman 

---------------------------------------------------------

Optional - 

1️⃣ Streaming responses
2️⃣ Vercel AI SDK (Support Agent only)
3️⃣ Typing indicator
4️⃣ README + API docs
5️⃣ Frontend demo


-------------------------------
To run backend - 
cd backend
node src/app.ts
npm install -D tsx, npx tsx src/app.ts
npm install @hono/node-server
npx tsx src/server.ts
npm install @ai-sdk/groq


TO run frontend - 
cd frontend
npm run dev


__________________________
# 1. Go to backend
cd backend

# 2. Install required runtime + dev dependencies
npm install @prisma/client
npm install -D prisma
npm install -D tsx
npm install csv-parser   # (optional, not used in final version but OK)

# 3. Generate Prisma Client
npx prisma generate

# 4. Run DB migration (fresh schema)
npx prisma migrate dev --name init

# 5. (Optional) Reset DB completely if needed
# ⚠️ This DROPS all tables
npx prisma migrate reset

# 6. Seed database from CSV (FINAL & STABLE)
npx tsx scripts/seedFromCsv.ts

# 7. Verify data (optional but recommended)
npx prisma studio

---------------------------------------------------------------

npm install -D vitest
npx vitest


npm install ai @ai-sdk/google