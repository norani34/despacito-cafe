# Despacito Café — Backend scaffold

This folder contains a production-ready scaffold for a NestJS + Prisma backend.

Quick start (local / development):

1. Copy `.env.example` to `.env` and set `DATABASE_URL` (Postgres) or use a local Postgres container.
2. Install dependencies:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Notes:
- The project expects a Postgres `DATABASE_URL` in environment.
- S3, Brevo, and reCAPTCHA integrations are placeholders — provide credentials before production.
- To build a Docker image: `docker build -t cafe-backend .`

Auth notes:
- Endpoints: `POST /api/auth/register`, `POST /api/auth/login`.
- Login sets a `jid` httpOnly cookie with refresh token and returns an access token.

Contact:
- Submissions are stored in DB and an admin email (env `ADMIN_EMAIL`) will receive notifications via Brevo.
