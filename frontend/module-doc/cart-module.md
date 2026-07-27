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

- POST /cart/items
- GET /cart
- PATCH /cart/items/:id
- DELETE /cart/items/:id
- DELETE /cart

---

## Database

carts

- id
- user_id
- created_at

cart_items

- id
- cart_id
- product_id
- quantity
- created_at
