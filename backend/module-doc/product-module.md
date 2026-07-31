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

- POST /products
- GET /products
- GET /products/:id
- PUT /products/:id
- DELETE /products/:id

- GET /products?search=
- GET /products?category=
- GET /products?page=&limit=

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
