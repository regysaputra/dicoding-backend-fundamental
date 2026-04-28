# OpenJob Submission (API + Consumer)

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Message%20Queue-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)

This submission is split into two standalone Node.js projects that communicate through RabbitMQ:

- `openjob_api`: REST API, PostgreSQL migrations, and RabbitMQ producer
- `openjob_consumer`: RabbitMQ consumer that sends email notifications via Nodemailer

## Architecture

- API pattern: `routes -> controller -> repository`
- On `POST /applications`, API inserts data then publishes `{ application_id }` to queue `applications:created`
- Consumer reads `application_id`, fetches full details from DB, then emails the job owner
- Most API responses follow: `{ code, status, data, message }`

## Project Structure

```text
Submission/
├─ openjob_api/
│  ├─ package.json
│  ├─ migrations/
│  └─ src/
└─ openjob_consumer/
   ├─ package.json
   └─ src/
```

## Prerequisites

- Node.js 18+
- PostgreSQL
- RabbitMQ (AMQP port `5672`)
- SMTP account for email sending

## Setup

### 1) Install dependencies

```bash
cd openjob_api
npm install

cd ../openjob_consumer
npm install
```

### 2) Create environment files

Create `openjob_api/.env`:

```env
# App
PORT=3000
ACCESS_TOKEN_KEY=your_access_secret
REFRESH_TOKEN_KEY=your_refresh_secret

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=dicoding_backend_fundamental

# Redis (if enabled)
REDIS_SERVER=localhost

# RabbitMQ producer
AMQP_URL=
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
```

Create `openjob_consumer/.env`:

```env
# PostgreSQL (must point to same DB used by API)
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=dicoding_backend_fundamental

# RabbitMQ consumer
AMQP_URL=
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# SMTP
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### 3) Run migrations (API project)

```bash
cd openjob_api
npm run migrate -- up
```

### 4) Start API

```bash
cd openjob_api
npm run dev
```

### 5) Start Consumer

```bash
cd openjob_consumer
npm run start
```

## Key Endpoints (API)

- `/users`
- `/authentications`
- `/companies`
- `/categories`
- `/jobs`
- `/applications`
- `/bookmarks`
- `/profile`
- `/documents`

Job search query params:

```text
GET /jobs?title=<keyword>&company-name=<keyword>
```

## RabbitMQ Notification Flow

1. User applies to a job via API
2. API publishes message to `applications:created`
3. Consumer receives message and extracts `application_id`
4. Consumer queries DB for applicant, job, company, and owner
5. Consumer sends email to `owner_email`

## Troubleshooting

### Consumer logs `Application not found: <id>`

Usually one of these:

- Consumer DB env points to a different database than API
- Application exists but related join data is incomplete (for example `companies.owner_user_id` is null)
- Message was produced in another environment/database

Quick checks:

```sql
SELECT id, user_id, job_id FROM applications WHERE id = '<application_id>';

SELECT c.id, c.owner_user_id
FROM applications a
JOIN jobs j ON j.id = a.job_id
JOIN companies c ON c.id = j.company_id
WHERE a.id = '<application_id>';
```

### RabbitMQ connection fails

- Ensure RabbitMQ is running
- Use AMQP port `5672` (not `15672`, which is management UI)
- If `AMQP_URL` is empty, host/user/password env vars must be valid

### SMTP email not sent

- Verify `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`
- For Gmail, use App Password (not regular account password)

## Useful Scripts

In `openjob_api/package.json`:

- `npm run start:dev`
- `npm run dev`
- `npm run lint`
- `npm run format`
- `npm run migrate -- <up|down|status>`

In `openjob_consumer/package.json`:

- `npm run start`
- `npm run dev`

## Notes

- Do not commit `.env`, `node_modules`, or uploads directories.
- Keep API and consumer running in separate terminals during queue testing.
