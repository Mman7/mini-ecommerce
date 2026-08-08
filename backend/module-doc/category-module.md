# Category Module

## Features

### Category CRUD

- Create Category
- Get Category
- Get Categories
- Update Category
- Delete Category

### Product Filtering

- Get Products By Category
- Filter Products By Category

### Category Status

- Active
- Inactive

### Admin

- Create Category
- Update Category
- Delete Category
- Enable Category
- Disable Category

---

# Flow

## Create Category

1. Admin creates a category
2. POST /categories
3. Check Admin Permission
4. Validate Category Name
5. Check Category Name Exists
6. Create Category
7. Return Category

---

## Get Categories

1. User requests categories
2. GET /categories
3. Get Active Categories
4. Return Categories

Example:

```text
Electronics
Clothing
Shoes
Accessories
```

---

## Get Products By Category

1. User selects a category
2. GET /categories/:id/products
3. Find Category
4. Find Products by category_id
5. Apply Pagination
6. Return Products

---

## Update Category

1. Admin selects a category
2. PUT /categories/:id
3. Check Admin Permission
4. Find Category
5. Validate New Name
6. Update Category
7. Return Updated Category

---

## Delete Category

1. Admin requests category deletion
2. DELETE /categories/:id
3. Check Admin Permission
4. Find Category
5. Check Category Has Products
6. Delete or Deactivate Category
7. Return Response

---

# APIs

## Public

GET /categories

GET /categories/:id

GET /categories/:id/products

## Admin

POST /categories

PATCH /categories/:id

DELETE /categories/:id

---

# Database

## categories

- id
- name
- description
- status
- created_at
- updated_at

## products

- id
- name
- price
- stock
- category_id
- status
- created_at
- updated_at

---

# Relationship

## Category → Product

One Category
→
Many Products

Example:

```text
Electronics
├── iPhone
├── MacBook
└── Keyboard
```

Database:

```text
categories
    │
    │ 1 : N
    ▼
products
```

---

# Business Rules

## Unique Category Name

Category name should usually be unique.

Example:

```text
Electronics
Electronics
```

Should not be allowed.

---

## Category With Products

Before deleting a Category:

1. Check if Products exist
2. If Products exist
3. Prevent Delete OR Reassign Products
4. If No Products
5. Allow Delete

---

## Inactive Category

Instead of deleting a category:

```text
status = inactive
```

Users cannot select it for new products.

Existing products can either:

- Remain in the category
- Be moved to another category

---

# Important Concepts

## Category

Used to group Products.

## category_id

Foreign Key in Product.

## One-to-Many

One Category
→
Many Products

## Filtering

Category can be used to filter Products.

## Soft Delete

Instead of permanently deleting:

```text
status = inactive
```

---

# Example

## Categories

```text
1 - Electronics
2 - Clothing
3 - Shoes
```

## Products

```text
iPhone
category_id = 1

MacBook
category_id = 1

T-Shirt
category_id = 2

Nike Shoes
category_id = 3
```

---

# Simple Flow

## Product List

1. User opens Product Page
2. GET /products
3. User selects Category
4. GET /products?category=electronics
5. Backend filters Products
6. Return Product List
