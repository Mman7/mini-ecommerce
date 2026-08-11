# Order Module

## Features

### Create Order

- Checkout Cart
- Create Order
- Create Order Items
- Calculate Total
- Save Product Price
- Deduct Stock
- Validate Active Product
- Atomic Order and Inventory Transaction

### Get Orders

- Get My Orders
- Get Order Detail
- Get Order Items

### Order Status

- Pending
- Paid
- Processing
- Shipped
- Delivered
- Cancelled

### Cancel Order

- Cancel Order
- Restore Stock
- Update Order Status

### Admin

- View All Orders
- View Order Detail (TODO)
- Update Order Status (TODO)

---

# Flow

## Checkout

1. User clicks Checkout
2. Get User ID from JWT
3. Get User Cart
4. Check Cart is not empty
5. Get Cart Items
6. Check Product Exists
7. Check Product is Active
8. Check Current Stock
9. Calculate Total
10. Create Order
11. Create Order Items
12. Deduct Product Stock
13. Return Order

Order creation uses a database transaction. Product price is saved on each
order item, and stock is decremented atomically only when enough stock is
available.

---

## Get My Orders

1. User requests orders
2. Get User ID from JWT
3. Find Orders by User ID
4. Get Order Items
5. Return Orders

---

## Get Order Detail

1. User requests an order
2. Get User ID from JWT
3. Find Order
4. Verify Order belongs to User
5. Get Order Items
6. Return Order Detail

---

## Cancel Order

1. User requests cancellation
2. Get User ID from JWT
3. Find Order
4. Verify Order belongs to User
5. Check Order Status
6. Restore Product Stock
7. Update Order Status
8. Return Updated Order

---

# APIs

## User

POST /api/orders

GET /api/orders/:orderId

PATCH /api/orders/:orderId/cancel

The user order-list endpoint is not implemented yet.

## Admin

GET /api/admin/orders

GET /api/admin/orders/:id (TODO)

PATCH /api/admin/orders/:id/status (TODO)

---

# Database

## orders

- id
- user_id
- total_amount
- status
- created_at
- updated_at

## order_items

- id
- order_id
- product_id
- quantity
- price
- subtotal

---

# Order Status

## Normal Flow

Pending
→ Paid
→ Processing
→ Shipped
→ Delivered

## Cancellation

Pending
→ Cancelled

Paid
→ Cancelled

Processing
→ Cancelled (Optional)

---

# Business Rules

## Price Snapshot

Order Item must save the product price at the time of purchase.

Example:

Product Price

```text
RM 100
```

User Checkout

```text
RM 100
```

Admin changes Product Price

```text
RM 120
```

Old Order

```text
RM 100
```

Therefore:

```text
order_items.price
```

must store the original purchase price.

---

## Stock Validation

Always check current stock during Checkout.

Do not rely on the stock information stored in the Cart.

```text
Cart
1. Add Product
2. Store Quantity

Checkout
1. Get Current Product
2. Check Current Stock
3. Create Order
```

---

## Transaction

The following operations should be inside a Database Transaction:

1. Create Order
2. Create Order Items
3. Deduct Stock
4. Clear Cart

If any operation fails:

```text
Rollback Everything
```

---

# Relations

## User → Order

```text
One User
→
Many Orders
```

## Order → Order Items

```text
One Order
→
Many Order Items
```

## Product → Order Items

```text
One Product
→
Many Order Items
```

## Cart → Order

```text
Cart
→
Checkout
→
Order
```

---

# Important Concepts

## Database Transaction

Ensure multiple database operations succeed or fail together.

## Stock Management

Prevent users from purchasing more items than available stock.

## Order Status

Control the lifecycle of an order.

## Price Snapshot

Preserve the price the customer actually paid.

## Authorization

Users can only access their own orders.

Admins can access all orders.

## Validation

Validate:

- Cart is not empty
- Product exists
- Product is active
- Stock is available
- Order belongs to user
- Order status allows cancellation

## Race Condition

Consider two users buying the last available item at the same time.

## Rollback

If creating the order succeeds but stock deduction fails, rollback the entire transaction.
