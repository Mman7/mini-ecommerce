# Mini Ecommerce

## Overview

Mini Ecommerce is a learning-focused full-stack storefront for a small gift and stationery shop. It contains a Next.js frontend, an Express API, Prisma data access, PostgreSQL persistence, authentication, carts, inventory, and order workflows.

The project is intentionally evolving rather than production-ready. The backend contains REST modules and database workflows, while several frontend pages are currently UI demonstrations and are not yet connected to the API.

## Features

- User registration, login, logout, and access-token refresh
- HTTP-only cookie authentication with `USER` and `ADMIN` roles
- User profile read, update, and delete endpoints
- Public product and category queries
- Admin product and category management
- Per-user carts with add, update, remove, and clear operations
- Inventory stock tracking and stock validation
- Order creation from submitted order items
- Atomic stock deduction during order creation
- Order lookup and cancellation with inventory restoration
- Admin totals for orders and revenue
- Next.js storefront pages for products, cart, checkout UI, profiles, orders, and dashboard sections

## Screenshots

Screenshots are not currently stored in the repository. Add them here when final project screenshots are available.

## Architecture

The frontend and backend are separate applications. The frontend is a Next.js App Router application. The backend is an Express API mounted under `/api`; it uses Prisma to access PostgreSQL. Docker Compose runs PostgreSQL, the backend, and the frontend as separate services.

```text
Browser
  |
  v
Next.js frontend :3000
  |
  v
Express API :5000 (/api)
  |
  v
Prisma Client + PostgreSQL adapter
  |
  v
PostgreSQL :5432
```

## Tech Stack

### Frontend

- Next.js `^16.3.0`
- React `^19.2.8`
- TypeScript `^5.9.3`
- Tailwind CSS `^4`
- shadcn/ui, Base UI `^1.7.0`, and ReUI-inspired components
- Lucide React `^1.27.0`

### Backend

- Node.js with TypeScript `^6.0.3`
- Express `^5.2.1`
- Prisma CLI `^7.9.1`
- Prisma Client and PostgreSQL adapter `^7.8.0`
- `pg` `^8.22.0`
- `bcrypt` `^6.0.0`
- `jsonwebtoken` `^9.0.3`

### Database

- PostgreSQL 16, provided by Docker Compose

### Authentication

- JWT access and refresh tokens
- HTTP-only cookies
- Refresh tokens persisted in the `RefreshToken` table

### Development Tooling

- npm
- Docker and Docker Compose
- Prisma migrations
- ESLint and Next.js ESLint configuration
- `tsx` watch mode for backend development

## Project Structure

```text
mini-ecommerce/
├── backend/
│   ├── prisma/                 Prisma schema and migrations
│   ├── src/
│   │   ├── middleware/         Authentication and authorization middleware
│   │   ├── modules/            Auth, users, products, carts, orders, and admin APIs
│   │   ├── generated/          Generated Prisma client output
│   │   ├── configs/            Database configuration
│   │   ├── interfaces/         Shared TypeScript interfaces
│   │   ├── types/              Request and domain types
│   │   └── utils/              JWT, password, and Prisma helpers
│   ├── module-doc/             Backend module notes
│   ├── .env.example            Safe local environment template
│   ├── Dockerfile              Backend development image
│   └── package.json             Backend scripts and dependencies
├── frontend/
│   ├── src/app/                Next.js routes and layouts
│   ├── src/components/         Storefront, dashboard, UI, and ReUI components
│   ├── src/lib/                Frontend helpers and mock product data
│   ├── src/types/              Frontend TypeScript types
│   ├── public/                 Static images and assets
│   ├── Dockerfile              Frontend development image
│   └── package.json             Frontend scripts and dependencies
├── uploads/                    Local upload storage directory
├── docker-compose.yml          PostgreSQL, backend, and frontend services
└── README.md
```

## Requirements

- Node.js 20 or newer. The backend image uses Node 20; the frontend image uses Node 22.
- npm
- Docker Desktop with Docker Compose
- PostgreSQL is supplied by Docker for the documented local workflow.

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd mini-ecommerce
```

Replace `<repository-url>` with the repository URL you use.

### 2. Create the backend environment file

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell, use:

```powershell
Copy-Item backend/.env.example backend/.env
```

For local development, replace the placeholder JWT secrets with unique values. Keep `DATABASE_URL` using the `postgres` hostname when the backend runs inside Compose.

### 3. Start the complete stack

```bash
docker compose up --build
```

Compose starts PostgreSQL, the backend, and the frontend. The backend container runs `npm run dev`; database migrations are not run automatically.

### 4. Apply database migrations

With the containers running, apply migrations inside the backend container:

```bash
docker compose exec backend npx prisma migrate deploy
```

If you are running the backend directly on the host, use the host database URL described in [Running Locally](#running-locally), then run the Prisma commands there.

### 5. Open the applications

- Frontend: <http://localhost:3000>
- Backend API base: <http://localhost:5000/api>
- PostgreSQL: `localhost:5432` (TCP; not an HTTP URL)

## Environment Variables

Copy `backend/.env.example` to `backend/.env`. The checked-in template contains placeholders only:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=change-me
DB_NAME=appdb
DATABASE_URL=postgresql://admin:change-me@postgres:5432/appdb?schema=public
PORT=5000
JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
```

`DATABASE_URL` must use `postgres` when the backend runs in Docker Compose and `localhost` when the backend runs directly on the host. Do not commit `backend/.env` or any file containing real secrets.

The PostgreSQL service in `docker-compose.yml` uses the same local development values: database `appdb`, user `admin`, and password `change-me`. Change these values together when customizing the local database configuration.

## Running Locally

### PostgreSQL with Docker

From the repository root:

```bash
docker compose up -d postgres
```

Use `DB_HOST=localhost` and this host URL in `backend/.env`:

```env
DATABASE_URL=postgresql://admin:change-me@localhost:5432/appdb?schema=public
```

### Backend directly on the host

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The backend listens on the `PORT` configured in `backend/.env`, which is `5000` in the template.

### Frontend directly on the host

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Next.js development server uses port `3000` by default.

## Useful Commands

Run backend commands from `backend/` and frontend commands from `frontend/`.

| Area     | Command                     | Purpose                                        |
| -------- | --------------------------- | ---------------------------------------------- |
| Backend  | `npm run dev`               | Start the Express API with `tsx watch`         |
| Backend  | `npm run build`             | Compile backend TypeScript to `dist/`          |
| Backend  | `npm start`                 | Run the compiled backend                       |
| Frontend | `npm run dev`               | Start Next.js development mode                 |
| Frontend | `npm run build`             | Create a production build                      |
| Frontend | `npm start`                 | Start the production Next.js server            |
| Frontend | `npm run lint`              | Run ESLint                                     |
| Prisma   | `npx prisma generate`       | Generate the Prisma client                     |
| Prisma   | `npx prisma migrate deploy` | Apply committed migrations                     |
| Docker   | `docker compose up --build` | Build and start all services                   |
| Docker   | `docker compose down`       | Stop the Compose services                      |
| Docker   | `docker compose down -v`    | Stop services and remove the PostgreSQL volume |

No Prisma seed script is configured in `backend/package.json`.

## Backend API

The Express application mounts its main router at `/api`.

| Route group       | Example endpoints                                                     | Access                                           |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| `/api/auth`       | `POST /login`, `/register`, `/logout`, `/refresh`                     | Public endpoints; logout and refresh use cookies |
| `/api/users`      | `GET`, `PATCH`, `DELETE /me`                                          | Authenticated users                              |
| `/api/products`   | `GET /`, `/:id`, `/count`                                             | Public                                           |
| `/api/carts`      | `GET /`, `POST /`, `PATCH /:itemId`, `DELETE /:itemId`, `DELETE /`    | Authenticated users                              |
| `/api/categories` | `GET /`, `/:categoryId`, `/:categoryId/products`                      | Public reads; product assignment requires admin  |
| `/api/inventory`  | `GET /:productId`                                                     | Public stock lookup                              |
| `/api/orders`     | `POST /`, `GET /:orderId`, `POST /:orderId/cancel`                    | Authenticated users                              |
| `/api/admin`      | Products, categories, users, orders, totals, and inventory operations | Authenticated `ADMIN` users                      |

Authentication middleware reads the `accessToken` HTTP-only cookie, verifies the JWT, and attaches the user to the request. The `isAdmin` middleware returns `403` unless the verified role is `ADMIN`.

## Frontend Pages

The following App Router pages exist in `frontend/src/app`:

| Route                           | Purpose                            |
| ------------------------------- | ---------------------------------- |
| `/`                             | Storefront homepage                |
| `/login`                        | Login UI                           |
| `/register`                     | Registration UI                    |
| `/forgot-password`              | Password recovery UI               |
| `/products`                     | Product browsing UI                |
| `/products/[id]`                | Product detail UI                  |
| `/cart`                         | Cart UI                            |
| `/payment`                      | Step-based checkout and payment UI |
| `/order-success`                | Order confirmation UI              |
| `/profile`                      | Profile area                       |
| `/profile/addresses`            | Address UI                         |
| `/profile/orders`               | Orders UI                          |
| `/profile/orders/[id]`          | Order detail UI                    |
| `/profile/settings`             | Profile settings UI                |
| `/profile/wishlist`             | Wishlist UI                        |
| `/dashboard`                    | Dashboard area                     |
| `/dashboard/products`           | Product administration UI          |
| `/dashboard/products/create`    | Product creation UI                |
| `/dashboard/products/[id]/edit` | Product editing UI                 |
| `/dashboard/categories`         | Category administration UI         |
| `/dashboard/customers`          | Customer administration UI         |
| `/dashboard/orders`             | Order administration UI            |
| `/dashboard/settings`           | Dashboard settings UI              |

Several pages currently use mock or static data and do not call the backend API.

## Authentication

- **Registration:** `POST /api/auth/register` creates a user and sets access and refresh cookies.
- **Login:** `POST /api/auth/login` validates credentials and sets both cookies.
- **Logout:** `POST /api/auth/logout` revokes the refresh token and clears cookies.
- **Access tokens:** JWTs expire after 15 minutes and are read from the `accessToken` HTTP-only cookie by protected routes.
- **Refresh tokens:** JWT refresh tokens expire after 7 days, are stored in the database, and are supplied through the `refreshToken` HTTP-only cookie to issue a new access token.
- **Protected routes:** User, cart, and order routes use `authMiddleware`.
- **Roles:** New users default to `USER`; admin routes require `ADMIN` through `isAdmin`.

Cookies are configured with `httpOnly`, `sameSite: "strict"`, and `secure` only when `NODE_ENV=production`.

## Data Model

Prisma defines these models in [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma):

- `User` belongs to the `USER` or `ADMIN` role and can have refresh tokens, carts, and orders.
- `RefreshToken` belongs to a user and stores a unique token with an expiration time.
- `Product` stores name, description, price, active state, and an optional category; it relates to inventory, cart items, and order items.
- `Category` contains products and has an active state.
- `Inventory` has a one-to-one product relationship and stores stock and an optional reorder threshold.
- `Cart` belongs to one user and contains `CartItem` records. `userId` is unique, so the schema allows one cart per user.
- `CartItem` connects a cart to a product and stores quantity.
- `Order` belongs to a user and contains `OrderItem` records, with a string status that defaults to `PENDING`.
- `OrderItem` connects an order to a product and stores quantity and the order-time price.

User, cart, order, category, product, inventory, and item relationships use cascading deletes where defined in the schema.

## Module Documentation

- [Product module](backend/module-doc/product-module.md)
- [Cart module](backend/module-doc/cart-module.md)
- [Order module](backend/module-doc/order-module.md)
- [Category module](backend/module-doc/category-module.md)
- [Inventory module](backend/module-doc/inventory-module.md)
- [Admin module](backend/module-doc/admin-module.md)
- [Upload module](backend/module-doc/upload-module.md)

The upload document contains module notes, but an upload router is not mounted in [`backend/src/routes.ts`](backend/src/routes.ts).

## Checkout and Payments

- **Cart:** authenticated users can add, update, remove, and clear cart items through `/api/carts`.
- **Checkout/order creation:** `POST /api/orders` accepts order items and creates an order for the authenticated user.
- **Inventory deduction:** the order service validates stock and deducts inventory as part of the order transaction. Cancellation restores inventory for eligible orders.
- **Payment processing:** there is no Stripe, PayPal, or other payment-provider integration. The frontend `/payment` route is a UI/demo stepper; it does not process real payments or connect the form to a payment gateway.

## Known Limitations

- No automated test suite is configured.
- No Prisma seed script or demo account is included.
- Frontend pages are largely UI-focused; products use mock data and the authentication forms, cart, payment, profile, and dashboard pages are not fully wired to the API.
- No real payment provider integration exists.
- Upload documentation exists, but the upload module is not mounted in the API.
- The backend provides order lookup by ID, but there is no user-facing backend endpoint for listing all orders for a user.
- Some admin workflows remain limited to the routes currently implemented, such as totals, CRUD operations, activation toggles, and inventory updates.
- No deployment configuration or production hosting setup is included.

## Roadmap

- [ ] Connect the Next.js frontend to the Express API.
- [ ] Add request validation and consistent frontend error handling.
- [ ] Add seed data and a documented demo account workflow.
- [ ] Add automated backend and frontend tests.
- [ ] Integrate a real payment provider and payment status handling.
- [ ] Complete missing admin workflows and user order history.
- [ ] Implement and document upload handling.
- [ ] Add production deployment configuration and operational documentation.

## License

No license has been specified in the repository. The project is currently intended for personal learning and experimentation.
