# OpenJob Submission

This repository contains two standalone Node.js projects connected through RabbitMQ:

- `openjob_api` - REST API, PostgreSQL migrations, and RabbitMQ producer
- `openjob_consumer` - RabbitMQ consumer that sends email notifications

## Repository Structure

```text
dicoding-backend-fundamental/
├─ openjob_api/
└─ openjob_consumer/
```

## Prerequisites

- Node.js 18+
- PostgreSQL
- RabbitMQ (AMQP port `5672`)
- SMTP account (for consumer email delivery)

## Quick Start (from repository root)

Install dependencies:

```bash
npm --prefix openjob_api install
npm --prefix openjob_consumer install
```

Run database migrations:

```bash
npm --prefix openjob_api run migrate -- up
```

Start API:

```bash
npm --prefix openjob_api run dev
```

Start consumer (in another terminal):

```bash
npm --prefix openjob_consumer run start
```

## Message Queue Flow

1. Client calls `POST /applications` on the API
2. API stores application and publishes `{ application_id }` to `applications:created`
3. Consumer reads the message, fetches related records from DB
4. Consumer sends email to the job owner

## Documentation

- Detailed setup, environment variables, scripts, and troubleshooting are in `openjob_api/README.md`.

## Submission Notes

- Do not include `.env`, `node_modules`, or uploads in commits/zips.
- Keep API and consumer running together when testing RabbitMQ features.

