# Admin Module

## Features

### Dashboard

- View Total Users
- View Total Products
- View Total Orders
- View Total Revenue (Optional)

---

### Product Management

- Create Product
- Update Product
- Delete Product
- Activate Product
- Deactivate Product

---

### Category Management

- Create Category
- Update Category
- Delete Category

---

### Order Management

- View All Orders
- View Order Details
- Update Order Status
- Cancel Order

---

### User Management

- View Users
- View User Details
- Disable User
- Enable User

---

### Authorization

- Admin Only Access
- Role-Based Authorization (RBAC)

---

## APIs

- GET /admin/dashboard

- GET /admin/products
- POST /admin/products
- PUT /admin/products/:id
- DELETE /admin/products/:id

- GET /admin/categories
- POST /admin/categories

- GET /admin/orders
- PUT /admin/orders/:id/status

- GET /admin/users
- PUT /admin/users/:id/status
