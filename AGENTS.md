# AGENTS Guide

## Big Picture
- Runtime is a small Express 5 API bootstrapped in `src/index.js` (`express.json()` -> `routes` -> `errorHandler`).
- Active service domains are `users` and `authentications`; both are mounted centrally in `src/routes/index.js`.
- Architecture pattern is `routes -> controller -> repository -> PostgreSQL` with JSON output normalized by `src/utils/response.js`.
- Database access is repository-local: each repository instantiates its own `new Pool()` (`src/services/*/repositories/*`).
- `companies` exists as partial scaffolding (`src/services/companies/*`) and is not mounted yet.

## Request and Error Flow
- Validate payloads at route level with `validate(schema)` from `src/middlewares/payload-validator.js` (strict: `allowUnknown: false`, `stripUnknown: true`).
- Query and URL param validators exist (`query-params-validator.js`, `url-params-validator.js`) but are currently underused; keep usage explicit per route.
- Controllers pass business failures with `next(new InvariantError(...))` / `next(new AuthenticationError(...))` / `next(new NotFoundError(...))`.
- `src/middlewares/error-handler.js` maps `ClientError` subclasses and Joi errors to the common response envelope.
- Success/failure payload format is always `{ code, status, data, message }` via `response(res, statusCode, message, data)`.

## Service Patterns to Mirror
- `users` creation flow: `POST /users` -> Joi schema (`src/services/users/validator/schema.js`) -> uniqueness check -> bcrypt hash -> insert -> return inserted `id`.
- `authentications` login flow: `POST /authentications` -> verify email/password -> issue JWT access+refresh -> persist refresh token in `authentications` table.
- Token refresh/logout both require refresh token existence in DB before action (`src/services/authentications/controller/authentication-controller.js`).
- IDs are generated in app code with `uuidv7()` before inserts (see `UserRepositories.createUser`).

## Data and Integration Contracts
- PostgreSQL schema is migration-driven in `migrations/` (users, companies, categories, jobs, applications, bookmarks, authentications).
- Current auth contract depends on `ACCESS_TOKEN_KEY` and `REFRESH_TOKEN_KEY` (`src/security/token-manager.js`).
- `bcrypt` is used for password hashing/verification; do not compare raw passwords directly.
- JWT refresh verification throws `InvariantError` on invalid token (`TokenManager.verifyRefreshToken`).

## Developer Workflows
- Install deps: `npm install`.
- Run API once: `npm run start:dev`; run with auto-restart: `npm run dev`.
- Lint and format: `npm run lint`, `npm run format`.
- Run Jest: `npm test` (no first-party tests are currently present in `src/`; add new tests outside `node_modules`).
- Run migrations with dotenv preload: `npm run migrate -- up` (or `down`/`status` args for `node-pg-migrate`).

## Practical Agent Notes
- Reuse existing response helper and exception classes instead of sending ad-hoc `res.json` from controllers.
- Keep new modules in the same folder shape: `services/<domain>/{routes,controller,repositories,validator}`.
- Wire new domain routers in `src/routes/index.js`; unfinished code under `services/companies` is currently inert.
- Prefer file-local, concrete patterns already used here over introducing framework-heavy abstractions.

