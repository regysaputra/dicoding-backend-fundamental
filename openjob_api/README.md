# Dicoding Backend Fundamental API

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Message%20Queue-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Backend API for a job platform submission project. It implements JWT auth, job/company/category management, applications, bookmarks, profiles, file uploads, and RabbitMQ-based async notifications with a consistent JSON response format.

## Highlights

- Express 5 + PostgreSQL architecture: `routes -> controller -> repository`
- JWT access/refresh token flow
- Joi validation for body, query, and URL params
- Job search support: `GET /jobs?title=<keyword>&company-name=<keyword>`
- RabbitMQ publish/consume flow when a candidate applies
- Nodemailer email notification to job owner from database data
- Standard response envelope: `{ code, status, data, message }`

## Tech Stack

- Node.js (ESM)
- Express 5
- PostgreSQL (`pg`)
- RabbitMQ (`amqplib`)
- Nodemailer (`nodemailer`)
- `node-pg-migrate`
- `jsonwebtoken`, `bcrypt`, `joi`, `multer`

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

# RabbitMQ
# Use 5672 for AMQP connections. Port 15672 is only for the RabbitMQ management UI.
AMQP_URL=
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Email notification consumer
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
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

### 5) Start RabbitMQ consumer

```bash
npm run consumer:applications
```

## RabbitMQ / Email Flow

1. Candidate applies via `POST /applications`.
2. The API inserts the application and publishes `{ application_id }` to RabbitMQ.
3. The consumer processes the message asynchronously.
4. The consumer queries the database to find the applicant and job owner.
5. The consumer sends an email notification to the job owner (not the applicant).

> Note: the notification flow expects each company to have an `owner_user_id` relation so the consumer can find the job owner email from the database.

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
- `/documents`

## Scripts

- `npm run start:dev` - run once
- `npm run dev` - run with nodemon
- `npm run consumer:applications` - run RabbitMQ consumer worker
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
    documents/
    message-queue/
```

## License

ISC
