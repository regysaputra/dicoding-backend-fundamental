# Dicoding Backend Fundamental API

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Backend API for a job platform submission project. It implements JWT auth, job/company/category management, applications, bookmarks, and profile endpoints with a consistent JSON response format.

## Highlights

- Express 5 + PostgreSQL architecture: `routes -> controller -> repository`
- JWT access/refresh token flow
- Joi validation for body, query, and URL params
- Job search support: `GET /jobs?title=<keyword>&company-name=<keyword>`
- Standard response envelope: `{ code, status, data, message }`

## Tech Stack

- Node.js (ESM)
- Express 5
- PostgreSQL (`pg`)
- `node-pg-migrate`
- `jsonwebtoken`, `bcrypt`, `joi`

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Create `.env`

```env
ACCESS_TOKEN_KEY=your_access_secret
REFRESH_TOKEN_KEY=your_refresh_secret

PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=dicoding_backend_fundamental
```

### 3) Run migrations

```bash
npm run migrate -- up
```

### 4) Start API

```bash
npm run dev
```

Server runs at `http://localhost:3000`.

## Quick Demo (cURL)

### Register user

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Regy","email":"regy@example.com","password":"secret123","role":"user"}'
```

### Login and get token

```bash
curl -X POST http://localhost:3000/authentications \
  -H "Content-Type: application/json" \
  -d '{"email":"regy@example.com","password":"secret123"}'
```

### Search jobs

```bash
curl "http://localhost:3000/jobs?title=backend&company-name=dicoding"
```

### Get profile (protected)

```bash
curl http://localhost:3000/profile \
  -H "Authorization: Bearer <access_token>"
```

## Endpoint Groups

- `/users`
- `/authentications`
- `/companies`
- `/categories`
- `/jobs`
- `/applications`
- `/bookmarks`
- `/profile`

## Scripts

- `npm run start:dev` - run once
- `npm run dev` - run with nodemon
- `npm run lint` - lint code
- `npm run format` - format with Prettier
- `npm run migrate -- <up|down|status>` - run migrations

## Project Structure

```text
src/
  routes/
  middlewares/
  security/
  services/
    users/
    authentications/
    companies/
    categories/
    jobs/
    applications/
    bookmarks/
    profiles/
```

## License

ISC


