# Inventory Module

## Features

### Stock Management

- Get Current Stock
- Increase Stock
- Decrease Stock
- Adjust Stock
- Check Stock Availability

### Stock Validation

- Product Exists
- Product is Active
- Stock >= Requested Quantity
- Prevent Negative Stock

### Stock Movement

- Stock In
- Stock Out
- Stock Adjustment
- Stock Restore

### Order Integration

- Check Stock During Checkout
- Deduct Stock After Order
- Restore Stock When Order is Cancelled

### Admin

- View Stock
- Update Stock
- View Stock History
- Low Stock Alert

---

# Flow

## Check Stock

1. User adds Product to Cart
2. Get Product ID
3. Get Current Stock
4. Compare Requested Quantity with Stock
5. If Stock is Enough → Allow
6. If Stock is Not Enough → Reject

---

## Deduct Stock

1. User Checkout
2. Get Order Items
3. Get Current Product Stock
4. Validate Stock
5. Deduct Quantity
6. Save Updated Stock

Example:

```text
Current Stock = 10
Order Quantity = 3

10 - 3 = 7
```

Result:

```text
Stock = 7
```

---

## Restore Stock

Used when an Order is Cancelled.

1. User Cancels Order
2. Find Order Items
3. Get Product ID
4. Get Order Quantity
5. Add Quantity Back to Stock
6. Update Product Stock

Example:

```text
Current Stock = 7
Cancelled Quantity = 3

7 + 3 = 10
```

Result:

```text
Stock = 10
```

---

# APIs

## User

- GET /api/inventory/:productId

## Admin

- POST /api/admin/inventory
- PATCH /api/admin/inventory/:productId

Inventory history and low-stock alerts are not implemented yet.

---

# Database

## products

- id
- name
- price
- stock
- status

## stock_movements (TODO)

- id
- product_id
- type
- quantity
- reason
- created_at

---

# Stock Movement

## Stock In

When inventory increases.

Examples:

- New Stock
- Supplier Restock
- Cancelled Order
- Returned Order

## Stock Out

When inventory decreases.

Examples:

- Order
- Damaged Product
- Manual Adjustment

## Stock Adjustment

Admin manually changes stock.

Example:

```text
System Stock = 20
Actual Stock = 18

Adjustment = -2
```

---

# Business Rules

## Never Allow Negative Stock

```text
Current Stock = 5
Requested Quantity = 6

Reject Order
```

---

## Always Check Stock During Checkout

Do not rely only on Cart validation.

```text
Add To Cart
→
Check Stock

Checkout
→
Check Stock Again
→
Deduct Stock
```

---

## Transaction

Order creation and stock deduction should be handled inside the same Database Transaction.

```text
1. Create Order
2. Create Order Items
3. Deduct Stock
4. Clear Cart
```

If one step fails:

```text
Rollback Everything
```

---

# Low Stock

Example:

```text
Stock <= 5
```

Mark as:

```text
Low Stock
```

Optional:

```text
Stock = 0
```

Mark as:

```text
Out of Stock
```

---

# Important Concepts

## Stock vs Inventory

Stock:

```text
How many units are currently available?
```

Inventory:

```text
Stock + Stock Movement History
```

## Stock Movement

Keep a record of why stock changed.

Example:

```text
Product: iPhone

+10  Restock
-2   Order #1001
-1   Damaged
+1   Order Cancelled
```

## Concurrency

Consider:

```text
Stock = 1

User A → Buy 1
User B → Buy 1
```

Both requests may happen at the same time.

Need to prevent:

```text
Stock = -1
```

This is where **Database Transaction / Atomic Update / Row Locking** becomes important.
