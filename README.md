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