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