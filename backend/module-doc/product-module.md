# Product Module

## Features

### Product CRUD

- Create Product
- Update Product
- Delete Product
- Get Product
- Get Product List

### Product Search

- Search by Name
- Search by Category

### Product Filter

- Filter by Category
- Filter by Price Range

### Product Pagination

- Page
- Limit
- Total Count

### Product Inventory

- Current Stock
- Update Stock
- Check Stock

### Product Image

- Upload Image
- Delete Image

### Product Status

- Active
- Inactive

### Product Validation

- Product Name Required
- Price > 0
- Stock >= 0

---

## APIs

- GET /api/products?page=&limit=
- GET /api/products/:id
- GET /api/products/count

Admin product management requires `authMiddleware` and `isAdmin`:

- POST /api/admin/products
- PATCH /api/admin/products/:id
- DELETE /api/admin/products/:id

Name and price-range filtering are currently supported by the service layer,
but category filtering and search query routes are not wired yet.

---

## Database

products

- id
- name
- description
- price
- stock
- image
- category_id
- status
- created_at
- updated_at
