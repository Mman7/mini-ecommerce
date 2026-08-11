# Admin Module

## Features

### Dashboard

- View Total Orders
- View Total Revenue
- Total users, products, categories, and inventory services exist but are not
  exposed through a dashboard endpoint yet.

---

### Product Management

- Create Product
- Update Product
- Delete Product
- Activate Product through update (dedicated endpoint TODO)
- Deactivate Product through update (dedicated endpoint TODO)

---

### Category Management

- Create Category
- Update Category
- Delete Category

---

### Order Management

- View All Orders
- View Order Details (TODO)
- Update Order Status (TODO)
- Cancel Order (TODO)

---

### User Management

- View Users
- View User Details (TODO)
- Disable User
- Enable User

---

### Authorization

- Admin Only Access
- Role-Based Authorization (RBAC)

---

## APIs

All admin routes are mounted under `/api/admin` and require authentication
plus the `ADMIN` role.

- GET /api/admin/total-orders
- GET /api/admin/total-revenue

- POST /api/admin/products
- PATCH /api/admin/products/:id
- DELETE /api/admin/products/:id

- POST /api/admin/categories
- PATCH /api/admin/categories/:categoryId
- DELETE /api/admin/categories/:categoryId
- POST /api/admin/categories/:categoryId/products/:productId
- DELETE /api/admin/categories/:categoryId/products/:productId

- GET /api/admin/orders
- GET /api/admin/users
- PATCH /api/admin/users/:id/activate
- PATCH /api/admin/users/:id/deactivate

- POST /api/admin/inventory
- PATCH /api/admin/inventory/:productId

The dashboard, admin order detail/status/cancel endpoints, product list
endpoint, user detail endpoint, and dedicated product status endpoints are
not implemented yet.
