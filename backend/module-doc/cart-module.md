# Cart Module

## Features

### Cart CRUD

- Add Item
- Update Quantity
- Remove Item
- Clear Cart
- Get Cart

### Cart Validation

- Product Exists
- Product Active
- Stock Available

### Cart Calculation

- Item Total
- Cart Total
- Total Quantity

### Cart Checkout Preparation

- Validate Stock
- Validate Product
- Ready For Checkout

---

## APIs

All routes are mounted under `/api/carts` and require authentication.

- POST /api/carts
- GET /api/carts
- PATCH /api/carts/:itemId
- DELETE /api/carts/:itemId
- DELETE /api/carts

The cart validates that the product exists, is active, has enough stock, and
that the requested quantity is a positive integer. A cart is created
automatically when a user adds the first item.

---

## Database

carts

- cart_id
- user_id
- created_at
- updated_at

cart_items

- id
- cart_id
- product_id
- quantity
- created_at
- updated_at
