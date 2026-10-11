# Pharmacy Management Postman Collection

This directory contains a source-audited Postman Collection v2.1 for the routes actually registered by `app.js`, plus a local environment. The audit found **26 application API routes** and **2 explicit infrastructure entry points**, for **28 distinct method/path endpoints**. All 28 are represented.

## Files

- `pharmacy-management.postman_collection.json`
- `pharmacy-management.postman_environment.json`

No application, database, configuration, or test file was changed while producing these artifacts.

## Backend setup

Install the project's dependencies, create a local `.env` from `.env.example`, configure PostgreSQL, generate the Prisma client, apply migrations, and start the API. The checked-in server reads `PORT`; the supplied Postman environment assumes the documented local value:

```text
http://localhost:3000
```

Change `baseUrl` if the backend uses another port or host. Authentication requires `JWT_SECRET` and `JWT_LIFETIME`. Registration and password recovery require working SMTP settings. Medicine creation and semantic search require `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, the `embed` Edge Function, pgvector, and compatible 384-dimensional embeddings.

The seed script is destructive: it deletes existing rows before recreating sample data. Use it only against a disposable local database. The environment pre-fills the seed admin email but deliberately leaves all password/token variables blank; no credential or secret was copied from `.env`.

## Import and authenticate

1. In Postman, import both JSON files and select **Pharmacy Management - Local**.
2. Set `adminPassword` to the password for the verified, active account in `adminEmail`. If you intentionally ran the repository seed against a disposable database, use the seed credentials shown in `seed.js`.
3. Run **Contract Checks / Protected Medicine List - Unauthenticated**, then **Login - Missing Password**, then **Login Admin**. Login stores HTTP-only `accessToken` and `refreshToken` cookies in Postman's cookie jar; protected requests work without exposing them to scripts.
4. Alternatively, place an externally obtained access JWT in the secret `accessToken` environment variable. Cookies take precedence in the backend middleware.

Registration creates auth cookies, but its new user remains unverified and cannot use protected routes. Complete email verification and then log in again.

## Safety flags

The environment defaults these controls to `false`, allowing a collection run to avoid unsafe or configuration-dependent calls:

- `runMutatingRequests`: enables create/update/purchase requests.
- `runDestructiveRequests`: enables medicine/supplier deletion, user deactivation, and logout.
- `runExternalRequests`: enables SMTP/Supabase-dependent requests.
- `runKnownDefectRequests`: enables requests whose current backend implementation is known to violate its intended contract.
- `runAuthorizationChecks`: enables the non-admin `/users` forbidden check after you manually establish a non-admin session.

Postman uses `pm.execution.skipRequest()` when a required flag is off. A skipped request is represented but not tested. Enable flags only against disposable data. Run dependent workflows individually or by folder; do not blindly enable every flag on shared data.

## Practical workflows

Read-only smoke run:

1. Run the three **Contract Checks** requests in order. The first clears API cookies; the last restores an admin session.
2. Run list/get requests in **Medicines**, **Suppliers**, and **Users**, then **Reports** and **Infrastructure**.
3. Enable `runExternalRequests` only if semantic search is configured, then run **Semantic Medicine Search**.

Supplier/purchase workflow on disposable data:

1. Set `runMutatingRequests=true` and run **Create Supplier**; it generates unique email/phone values and captures `supplierId`.
2. Ensure `medicineId` identifies an existing medicine. To create one, also enable `runExternalRequests`, run **Create Medicine**, and let it capture `medicineId`.
3. Run **Get Supplier**, then **Create Purchase**. The purchase creates stock and captures `purchaseId`.
4. Run report requests to inspect inventory effects.
5. Do not expect **Delete Supplier** to succeed after a purchase because batch references deliberately block it.

Medicine workflow:

1. Enable `runMutatingRequests` and `runExternalRequests`.
2. Run **Create Medicine** → **Get Medicine** → **Update Medicine**.
3. Enable `runDestructiveRequests` and run **Delete Medicine** only if no batch or transaction references it.

User administration workflow:

1. **List Users** captures a non-admin `userId` when available.
2. **Get User** and **Update User** use that ID.
3. **Deactivate User** is a destructive soft delete and also removes the user's stored refresh token; enable `runDestructiveRequests` only when intended.

Keep **Session Teardown / Logout** last. Its request body contains a validator-only dummy token, while the controller actually uses the `refreshToken` cookie.

## Manual and external verification

These registered endpoints are represented but need manual setup or deliberate opt-in:

| Endpoint | Reason |
|---|---|
| `POST /api/v1/auth/sign-up` | Creates data and requires working SMTP; use a reachable, unique email. |
| `GET /api/v1/auth/verify-email` | Requires the raw token received by email in `verificationToken`. |
| `POST /api/v1/auth/forgot-password` | Writes a reset token and may send email. |
| `POST /api/v1/auth/reset-password` | Requires emailed token and is currently blocked by a validator/controller mismatch. |
| `POST /api/v1/medicine` | Creates data and calls the Supabase embedding service. |
| `PATCH /api/v1/suppliers/:id` | Current controller targets Medicine instead of Supplier. |
| `DELETE /api/v1/medicine/:id` | Destructive and may be blocked by relations. |
| `DELETE /api/v1/suppliers/:id` | Destructive; blocked when batches reference the supplier. |
| `DELETE /api/v1/users/:id` | Deactivates a user and invalidates its refresh token. |
| `POST /api/v1/purchase` | Creates purchase, batch, and line-item records. |
| `POST /api/v1/sale` | Deducts stock and currently uses a hard-coded user ID. |
| `GET /api/v1/search` | Requires the Supabase Edge Function and pgvector data. |
| `POST /api/v1/auth/logout` | Deletes the current refresh-token record and clears cookies. |

No endpoint accepts a file upload, multipart body, binary body, or local file selection. There is no registered refresh-token endpoint even though `src/controllers/auth/refreshToken.js` exists; it is correctly excluded.

## Endpoint inventory and coverage

| Group | Method | Path | Access | Test status |
|---|---|---|---|---|
| Auth | POST | `/api/v1/auth/sign-up` | Public | Scripted; SMTP/manual flag |
| Auth | POST | `/api/v1/auth/login` | Public | Scripted |
| Auth | POST | `/api/v1/auth/logout` | Refresh cookie plus validator body | Scripted; destructive flag |
| Auth | GET | `/api/v1/auth/verify-email` | Public token | Scripted; emailed token |
| Auth | POST | `/api/v1/auth/forgot-password` | Public | Scripted; SMTP/manual flag |
| Auth | POST | `/api/v1/auth/reset-password` | Public token | Scripted; known defect |
| Suppliers | GET | `/api/v1/suppliers` | Admin, pharmacist | Scripted |
| Suppliers | POST | `/api/v1/suppliers` | Admin, pharmacist | Scripted; mutation flag |
| Suppliers | GET | `/api/v1/suppliers/:id` | Admin, pharmacist | Scripted |
| Suppliers | DELETE | `/api/v1/suppliers/:id` | Admin, pharmacist | Scripted; destructive flag |
| Suppliers | PATCH | `/api/v1/suppliers/:id` | Admin, pharmacist | Scripted; known defect |
| Medicines | GET | `/api/v1/medicine` | Admin, pharmacist, cashier | Scripted |
| Medicines | GET | `/api/v1/medicine/:id` | Admin, pharmacist, cashier | Scripted |
| Medicines | POST | `/api/v1/medicine` | Admin, pharmacist | Scripted; mutation/external flags |
| Medicines | DELETE | `/api/v1/medicine/:id` | Admin, pharmacist | Scripted; destructive flag |
| Medicines | PATCH | `/api/v1/medicine/:id` | Admin, pharmacist | Scripted; mutation flag |
| Users | GET | `/api/v1/users` | Admin | Scripted, including optional 403 case |
| Users | GET | `/api/v1/users/:id` | Admin | Scripted |
| Users | PATCH | `/api/v1/users/:id` | Admin | Scripted; mutation flag |
| Users | DELETE | `/api/v1/users/:id` | Admin | Scripted; destructive flag |
| Purchases | POST | `/api/v1/purchase` | Admin, pharmacist | Scripted; mutation flag |
| Sales | POST | `/api/v1/sale` | Admin, pharmacist, cashier | Scripted; known defect/mutation flags |
| Reports | GET | `/api/v1/reports/low_quantity` | Admin, pharmacist, cashier | Scripted |
| Reports | GET | `/api/v1/reports/expired` | Admin, pharmacist, cashier | Scripted |
| Reports | GET | `/api/v1/reports/nearExpiry` | Admin, pharmacist, cashier | Scripted |
| Search | GET | `/api/v1/search` | Admin, pharmacist, cashier | Scripted; external flag |
| Infrastructure | GET | `/api-docs/` | Public | Scripted |
| Infrastructure | GET | `/favicon.ico` | Public | Scripted |

Coverage is **28/28 distinct registered endpoints (100%)**. Every endpoint has a Postman test script, but a script only executes when its request is sent and not skipped. No requests were executed against a running database-backed server during generation, so runtime behavior is not claimed as verified. Swagger's middleware-owned CSS/JS asset URLs are not counted as separately registered application routes.

## Backend contract issues discovered

- `POST /api/v1/auth/reset-password`: the controller reads `req.body.token`, but `resetPasswordSchema` does not define `token`; Zod strips it. A schema-valid request therefore reaches the controller without a token and returns a default 500.
- `PATCH /api/v1/suppliers/:id`: the supplier route invokes a controller that queries and updates `prisma.medicine`, not `prisma.supplier`.
- `POST /api/v1/sale`: the controller uses hard-coded `userId = 12` rather than the authenticated user ID, commonly causing a foreign-key failure on seeded data.
- `POST /api/v1/auth/sign-up`: role is required and validated but omitted from `prisma.user.create`, so the schema default `user` is stored instead of the requested supported role.
- `POST /api/v1/auth/logout`: body validation requires `token`, while the controller ignores it and requires the refresh cookie; the route has no authenticate middleware.
- `POST /api/v1/medicine`: Zod permits `min_quantity: 0`, but the controller's truthiness check rejects it as missing.
- `GET /api/v1/users`: query validation stores parsed values in `req.validatedQuery`, but the controller reads raw `req.query`. `page`/`limit` can therefore reach Prisma as strings, and the `typeof req.query.isActive === "boolean"` branch never applies the active-status filter. Those collection parameters are disabled by default.
- Zod produces field-level validation details, but the global error handler does not copy `err.errors` into its response object, so clients receive only `{ "msg": "Validation error" }`.
- Several `CustomAPIError` calls omit a status code (including unverified login and invalid reset/verification tokens), so the global error handler returns 500 rather than a client error.
- The sale request validates `unit_price`, but business logic ignores it and uses the database selling price.
- The checked-in OpenAPI document is incomplete relative to registered routes and differs from implementation details; this collection follows source registration and handlers instead.

These issues are documented only; application code was not modified.

## Validation scope

Validation performed on 2026-10-11:

- Both deliverable JSON files parsed successfully.
- The collection passed AJV validation against Postman's official Collection v2.1 draft-04 schema.
- Runtime router introspection and a separate collection audit agreed on 28 distinct endpoints; all 28 are represented and have test scripts.
- All 19 referenced Postman variables are defined. All 50 pre-request/test scripts passed JavaScript syntax compilation. No credential-like value was found in environment values.
- Safe in-process runtime probes passed without database operations: Swagger UI 200, favicon 204, protected medicine request without credentials 401, invalid login body 400, and unknown route 404.
- The repository Jest run executed 44 tests successfully across 7 passing suites. Four additional suites did not start because their existing `jest.mock("../../lib/prisma.js")` paths do not resolve from their test directories. No test or application file was changed to work around this.

Database-backed success workflows were not executed, so their runtime success is not claimed. To verify them, start an isolated local backend, select this environment, fill only local test credentials, keep safety flags false initially, and run the collection in the order described above.
