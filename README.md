# Mini Ecommerce

A learning-focused full-stack storefront for a small gift and stationery shop. The repository contains a Next.js storefront, an Express REST API, PostgreSQL persistence through Prisma, and Docker Compose configuration for local development.

This project is still evolving. Some frontend areas are connected to the API while others remain mock, seeded, or presentation-focused. The Compose setup is for development and is not production-ready as-is; see [Deployment](#deployment).

## # Video Showcase
See the storefront and admin experience in action, including product browsing, product details, cart and checkout flows, customer account pages, wishlist functionality, and the admin dashboard.

<!-- Replace the placeholder with the actual showcase video URL/embed. -->

🎥 HomePage



https://github.com/user-attachments/assets/d591ddfa-5da0-4175-903d-c004be329d1d

https://github.com/user-attachments/assets/17c4f8f1-e4d0-46bf-9723-484a24a44771







The showcase demonstrates the current state of the application and highlights both completed API-connected workflows and frontend areas that are still using mock or seeded data.


## What It Builds

- A customer storefront with product browsing, product details, cart, checkout, profile, address, order, and wishlist screens.
- An admin dashboard UI for product, category, customer, order, and settings workflows.
- An API for authentication, users and addresses, products, categories, carts, favourites, inventory, orders, admin operations, and Stripe payments.
- Database workflows for stock checks and order fulfillment, including payment fulfillment from a verified Stripe webhook.
- Local product image storage served from `/uploads`.

Frontend completeness varies by page: payment and several API modules are connected, while some screens still use fixture or seeded data. Treat the UI as a work in progress rather than assuming every screen is backed by live API data.

## Architecture

```text
Browser
  -> Next.js App Router (:3000)
  -> Next.js rewrites (/api/* and /uploads/*)
  -> Express API (:5000)
  -> Prisma Client + PostgreSQL adapter
  -> PostgreSQL 16
```

The browser normally calls the frontend origin. Next.js rewrites API and uploaded-file requests to the backend. In Docker Compose, the frontend uses `BACKEND_URL=http://backend:5000`; when running on the host the default is `http://localhost:5000`.

## Technology

### Frontend

- Next.js 16 App Router, React 19, and TypeScript 5
- Tailwind CSS 4, shadcn/ui conventions, Base UI, and project-local ReUI-inspired components
- TanStack Query for server-state utilities and TanStack Table for data tables
- Zustand for client state; React Hook Form for forms
- Stripe.js and React Stripe.js for checkout
- Recharts for charts, Motion for animation, and Lenis for smooth scrolling
- Lucide React and Font Awesome for icons
- ESLint, Prettier, and the Tailwind Prettier plugin

### Backend and data

- Node.js 22 in the included Dockerfiles; TypeScript 6 and Express 5
- Prisma 7, Prisma Client, PostgreSQL adapter, and `pg`
- PostgreSQL 16; the custom Postgres image enables `pg_cron`
- `bcrypt` for password hashing, `jsonwebtoken` for JWTs, and `cookie-parser` for cookie handling
- Multer for upload handling utilities, `slugify` for product slugs, and Stripe's Node SDK for payments
- `tsx` for the backend development watcher; Prisma migrations are in `backend/prisma/migrations`

Dependency versions are defined in `frontend/package.json` and `backend/package.json`.

## Repository Layout

```text
backend/
  prisma/                 Prisma schema, migrations, and seed script
  src/modules/            Feature-oriented API modules
  src/middleware/         Authentication and authorization
  src/configs/            Environment loading
  src/utils/              Prisma and shared helpers
  module-doc/             Backend module notes
frontend/
  src/app/                Next.js routes and layouts
  src/api/                Frontend API clients
  src/components/         Storefront, dashboard, and UI components
  src/store/              Client-side state
  src/lib/                Shared frontend helpers
  public/                 Static assets
postgres/                 Custom PostgreSQL image configuration
uploads/                  Local uploaded files, mounted into the API container
docker-compose*.yml       Development and production-overlay Compose files
```

## Requirements

- Node.js 22 and npm for host-based development
- Docker Desktop with Docker Compose for the all-in-one development setup
- Stripe test account and Stripe CLI only when testing checkout payments

## Quick Start: Docker

The Compose configuration reads PostgreSQL settings from a root `.env` and backend settings from `backend/.env.docker`. Those files are ignored by Git and are not included as templates. Create them locally before starting the containers.

Root `.env`:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=change-me
POSTGRES_DB=appdb
```

Create `backend/.env.docker` with the following values. Set unique local JWT secrets; add Stripe values if you plan to test checkout.

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=change-me
DB_NAME=appdb
DATABASE_URL=postgresql://admin:change-me@postgres:5432/appdb?schema=public
PORT=5000
UPLOAD_DIR=/app/uploads
JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
STRIPE_CURRENCY=jpy
```

Use the same database name, user, and password in both files. For example, if you change the PostgreSQL credentials in root `.env`, update `DB_USER`, `DB_PASSWORD`, and `DATABASE_URL` in `backend/.env.docker` too.

From the repository root:

```bash
docker compose up --build
```

The default Compose command includes `docker-compose.override.yml`, which exposes the local ports and runs the backend and frontend in development/watch mode. In a second terminal, generate the Prisma client and apply migrations:

```bash
docker compose exec backend npx prisma generate
docker compose exec backend npx prisma migrate deploy
```

Optional: load demo data with `docker compose exec backend npm run db:seed`. **The seed script deletes existing application records before inserting demo data. Do not run it against data you need to keep.** It creates local demo accounts, including `admin@komorebi.com` with password `Password123!`; use only in a disposable development database and change/remove these credentials before any public deployment.

Open:

- Storefront: <http://localhost:3000>
- API: <http://localhost:5000/api>
- PostgreSQL: `localhost:5432` (database protocol, not a web page)

To stop the containers, run `docker compose down`. `docker compose down -v` also deletes the database volume and all persisted database data.

## Run Services on the Host

For host development, start PostgreSQL with `docker compose up -d postgres`. Create `backend/.env.local` using the same backend variables above, but set `DB_HOST=localhost` and use this database URL:

```env
DATABASE_URL=postgresql://admin:change-me@localhost:5432/appdb?schema=public
```

Install dependencies and start the backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

In a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend proxies `/api` and `/uploads` to `http://localhost:5000` by default. For Stripe checkout, create `frontend/.env.local` with `NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...` and configure the matching backend Stripe secrets. Restart the frontend after changing its environment.

## Environment Variables

| Variable                                                  | Used by             | Purpose                                                                                     |
| --------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `POSTGRES_USER`                                           | Root Compose `.env` | PostgreSQL container user                                                                   |
| `POSTGRES_PASSWORD`                                       | Root Compose `.env` | PostgreSQL container password                                                               |
| `POSTGRES_DB`                                             | Root Compose `.env` | PostgreSQL database name                                                                    |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Backend             | Database connection components                                                              |
| `DATABASE_URL`                                            | Backend and Prisma  | PostgreSQL connection string; hostname is `postgres` in Compose and `localhost` on the host |
| `PORT`                                                    | Backend             | API listen port; use `5000` for the documented setup                                        |
| `UPLOAD_DIR`                                              | Backend             | Filesystem directory used for uploaded files                                                |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`                 | Backend             | Signing secrets for access and refresh tokens                                               |
| `STRIPE_SECRET_KEY`                                       | Backend             | Stripe secret API key; optional unless using payments                                       |
| `STRIPE_WEBHOOK_SECRET`                                   | Backend             | Stripe webhook signature secret; required for webhook verification                          |
| `STRIPE_CURRENCY`                                         | Backend             | Payment currency; defaults to `jpy` in the payment service                                  |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`                           | Frontend            | Stripe publishable key used by the browser checkout                                         |
| `BACKEND_URL`                                             | Frontend            | Rewrite target for `/api` and `/uploads`; defaults to `http://localhost:5000`               |

Keep real secrets in ignored environment files or a deployment secret manager. Never commit them. `NEXT_PUBLIC_*` values are browser-visible and must never contain secret keys.

## Frontend Areas

The App Router includes the storefront home and about pages; product list and detail pages; login, registration, and password-recovery screens; cart, payment, and order confirmation; profile, saved addresses, orders, settings, and wishlist; and dashboard pages for products, categories, customers, orders, and settings. Dynamic pages use route segments such as `/products/[id]` and `/dashboard/orders/[id]`.

Some areas use backend API clients under `frontend/src/api`; others still rely on mock or seed data. The frontend uses Next.js rewrites rather than requiring browser-side requests directly to a separate backend origin.

## Backend API

The Express router is mounted at `/api`. Main route groups:

| Route group            | Purpose                                                                         | Access                                                  |
| ---------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `/api/auth`            | Registration, login, logout, and token refresh                                  | Login/register are public; logout/refresh use cookies   |
| `/api/users`           | Current user profile and address workflows                                      | Authenticated user                                      |
| `/api/products`        | Public product queries and count                                                | Public reads                                            |
| `/api/categories`      | Category queries and category/product administration                            | Public reads; writes are restricted                     |
| `/api/carts`           | Read and modify the current user's cart                                         | Authenticated user                                      |
| `/api/favourites`      | List, add, and remove favourites                                                | Authenticated user                                      |
| `/api/inventory`       | Product stock lookup                                                            | Public read                                             |
| `/api/orders`          | Create, look up, and cancel orders                                              | Authenticated user; admin routes provide broader access |
| `/api/payments`        | Create a PaymentIntent and read payment status                                  | Authenticated user                                      |
| `/api/webhooks/stripe` | Verify Stripe events and fulfill successful payments                            | Stripe-signed webhook                                   |
| `/api/admin`           | Administrative product, category, user, order, totals, and inventory operations | Authenticated `ADMIN`                                   |

Authentication uses `accessToken` and `refreshToken` HTTP-only cookies. Access tokens are short-lived; refresh tokens are stored in the database. Protected handlers validate the user, and admin handlers require the `ADMIN` role. Cookies use `sameSite: "strict"` and are marked `secure` when `NODE_ENV=production`.

## Data and Business Rules

The Prisma schema is in [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma). Core models include:

- `User`, `UserAddress`, and `RefreshToken` for accounts, saved delivery addresses, and sessions
- `Product`, `ProductImage`, `Category`, and `Inventory` for catalog and stock
- `Cart` and `CartItem` for each user's cart
- `Favourite` for a user's saved products
- `Order` and `OrderItem` for order snapshots, delivery details, status, and Stripe PaymentIntent association

Order creation validates stock and performs inventory changes with database transactions. Stripe checkout calculates the amount from the signed-in user's current cart on the server. Successful webhook events create the order; the payment intent ID is unique to support idempotent fulfillment. The frontend checkout expects the configured Stripe publishable key and a saved delivery address.

## Seed Data and Demo Accounts

The backend seed command is `npm run db:seed` (run from `backend/`, or through `docker compose exec backend npm run db:seed`). It clears existing records and generates demo customers, admins, catalog, and order data. One admin login is `admin@komorebi.com` / `Password123!`. These credentials are public in the seed source and are strictly for a local disposable database.

## Useful Commands

Run backend commands from `backend/` and frontend commands from `frontend/`.

| Area     | Command                     | Purpose                                            |
| -------- | --------------------------- | -------------------------------------------------- |
| Backend  | `npm run dev`               | Start Express with `tsx watch`                     |
| Backend  | `npm run build`             | Compile TypeScript to `dist/`                      |
| Backend  | `npm start`                 | Run compiled backend output                        |
| Backend  | `npm run db:seed`           | Clear and repopulate the database with demo data   |
| Backend  | `npm run db:reset`          | Reset database and reapply migrations; destructive |
| Frontend | `npm run dev`               | Start Next.js development server                   |
| Frontend | `npm run build`             | Create a production Next.js build                  |
| Frontend | `npm start`                 | Serve a previously built Next.js app               |
| Frontend | `npm run lint`              | Run ESLint                                         |
| Prisma   | `npx prisma generate`       | Generate the Prisma client                         |
| Prisma   | `npx prisma migrate deploy` | Apply committed migrations                         |
| Docker   | `docker compose up --build` | Build and start local services                     |
| Docker   | `docker compose down`       | Stop local services                                |
| Docker   | `docker compose down -v`    | Stop services and remove persisted database data   |

There is currently no automated test command configured in either package.

## Stripe Local Testing

Configure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in the backend environment, and `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` in the frontend environment. Use Stripe test keys, then run the Stripe CLI from the host:

```bash
stripe listen --events payment_intent.succeeded,refund.created,refund.updated --forward-to localhost:5000/api/webhooks/
```

Copy the CLI-generated `whsec_...` secret into the backend environment and restart the backend. Use Stripe's test card `4242 4242 4242 4242` with any future expiration date and CVC. Do not use test credentials for a live deployment.

## Deployment

### Current status

The provided Docker Compose files support local development. `docker-compose.prod.yml` is only an overlay/stub and is **not a working production deployment by itself**: it switches the containers to `npm start`, but the Dockerfiles do not build the backend `dist/` directory or frontend `.next` production output. The frontend also needs its public Stripe key available when its client bundle is built. Do not expose this stack publicly until production images and configuration have been completed.

### Before a production deployment

1. Create production Dockerfiles or build stages that install production dependencies and run the backend TypeScript build and frontend Next.js build.
2. Configure production-only environment variables through the hosting platform's secret manager. Use strong unique JWT secrets, production database credentials, the correct `DATABASE_URL`, Stripe live keys, and the production webhook secret.
3. Set the frontend backend rewrite target and ensure the Stripe publishable key is provided at build time. Keep the Stripe secret key and webhook secret backend-only.
4. Put the services behind HTTPS and a reverse proxy or managed ingress. Configure secure cookies, allowed origins/hosts, request limits, and appropriate logging for the public domain.
5. Persist and back up PostgreSQL and uploaded files. Keep PostgreSQL private; the production Compose overlay removes its published host port.
6. Run `prisma migrate deploy` as a controlled release step before routing traffic to a new backend version. Do not run the destructive seed script in production.
7. Add health checks, monitoring, restore procedures, and automated tests before treating the service as production-ready.

Once production images exist, the intended overlay can be exercised with `docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d`, but the current repository needs the build and operational work above first.

## Known Gaps

- Some storefront and dashboard pages are UI demonstrations or use mock/seeded data; frontend integration is not complete across all workflows.
- Automated backend and frontend tests are not configured.
- The upload route is not mounted in the Express router, although uploaded files can be served from the configured `/uploads` directory and upload module notes exist.
- The production Compose overlay is incomplete, and there is no TLS/reverse-proxy, hosting-provider, backup, or monitoring configuration.
- Seed data uses fixed demo credentials and the seed script deletes existing records.

## Module Notes

- [Product module](backend/module-doc/product-module.md)
- [Cart module](backend/module-doc/cart-module.md)
- [Order module](backend/module-doc/order-module.md)
- [Category module](backend/module-doc/category-module.md)
- [Inventory module](backend/module-doc/inventory-module.md)
- [Admin module](backend/module-doc/admin-module.md)
- [Upload module](backend/module-doc/upload-module.md)

## License

No license has been specified in this repository. It is currently intended for personal learning and experimentation.
