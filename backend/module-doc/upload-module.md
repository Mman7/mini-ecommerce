# File Module

## Purpose

The File module handles file upload and storage infrastructure for the backend.

For the current application, files are primarily uploaded as part of another resource operation, such as creating a product.

The File module does not need its own public `/files` API route.

The Product module uses the File module's Multer middleware when handling product creation or product image updates.

---

## Responsibilities

### File Module

The File module is responsible for:

- Configuring Multer
- Parsing `multipart/form-data`
- Validating uploaded files
- Limiting file size
- Generating unique filenames
- Storing uploaded files
- Deleting stored files
- Checking whether a file exists
- Generating file URLs
- Abstracting the storage implementation

### Product Module

The Product module is responsible for:

- Deciding when images are required
- Deciding which image is the thumbnail
- Managing product image ordering
- Creating `ProductImage` database records
- Associating images with a product
- Removing product images

The File module should not contain Product business logic.

---

# Module Structure

    backend/
    └── src/
        └── modules/
            ├── product/
            │   ├── product.controller.ts
            │   ├── product.service.ts
            │   ├── product.route.ts
            │   └── ...
            │
            └── file/
                ├── file.config.ts
                ├── file.service.ts
                └── index.ts

---

# Upload Flow

    Frontend
       │
       │ FormData
       │
       │ thumbnail
       │ productImages[]
       │
       ▼
    POST /products
       │
       ▼
    Product Route
       │
       ▼
    Multer Middleware
       │
       ├── Parse multipart/form-data
       ├── Validate file type
       ├── Validate file size
       ├── Generate unique filename
       └── Store file
       │
       ▼
    Product Controller
       │
       ▼
    Product Service
       │
       ├── Create Product
       │
       └── Create ProductImage records
       │
       ▼
    PostgreSQL

---

# FormData

## What is FormData?

`FormData` is a browser API used to construct a `multipart/form-data` request.

It can contain both normal values and files.

Example:

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));

    formData.append("thumbnail", thumbnailFile);

    for (const image of productImages) {
      formData.append("productImages", image);
    }

Send the request:

    await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

Do not manually set:

`Content-Type: multipart/form-data`

The browser automatically generates the correct `Content-Type` including the multipart boundary.

---

# FormData Fields

The Product API accepts:

| Field           | Type   | Required | Description            |
| --------------- | ------ | -------: | ---------------------- |
| `name`          | Text   |      Yes | Product name           |
| `description`   | Text   |      Yes | Product description    |
| `price`         | Text   |      Yes | Product price          |
| `thumbnail`     | File   |      Yes | Product thumbnail      |
| `productImages` | File[] |       No | Product display images |

Example:

    name            = Coffee
    description     = Premium coffee beans
    price           = 20.00
    thumbnail       = coffee-thumbnail.jpg
    productImages   = coffee-front.jpg
    productImages   = coffee-side.jpg
    productImages   = coffee-back.jpg

---

# Multer

## Why Multer?

Express does not parse `multipart/form-data` by itself.

Multer is middleware that parses the multipart request and makes uploaded files available through:

    req.file

or:

    req.files

For this application, Multer is used by the Product route.

    Frontend
       │
       │ multipart/form-data
       ▼
    Multer
       │
       ├── req.body
       └── req.files

---

# Multer Configuration

## `file.config.ts`

    import multer, { FileFilterCallback } from "multer";
    import path from "path";
    import { randomUUID } from "crypto";
    import { Request } from "express";

    const ALLOWED_MIME_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const storage = multer.diskStorage({
      destination: "/app/uploads",

      filename: (
        _req: Request,
        file: Express.Multer.File,
        cb,
      ) => {
        const extension = path
          .extname(file.originalname)
          .toLowerCase();

        cb(null, `${randomUUID()}${extension}`);
      },
    });

    const fileFilter = (
      _req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ) => {
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(
          new Error(
            "Only JPEG, PNG, and WebP images are allowed",
          ),
        );

        return;
      }

      cb(null, true);
    };

    export const upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    });

---

# File Naming

The backend generates the storage filename.

The frontend does not need to rename the file.

For example, the frontend sends:

    coffee.jpg

Multer stores it as:

    550e8400-e29b-41d4-a716-446655440000.jpg

The original filename remains available through:

    file.originalname

The original filename should not be used directly as the storage filename.

---

# Why Use UUID?

The backend should generate a UUID for stored filenames.

Example:

    import { randomUUID } from "crypto";

    const filename = `${randomUUID()}${extension}`;

This prevents collisions.

For example, two users can both upload:

    product.jpg

and the stored files can become:

    550e8400-e29b-41d4-a716-446655440000.jpg
    2b6f8a1d-7e29-4c3d-a1a5-1a2e3f4b5c6d.jpg

The frontend does not need to know or control these filenames.

---

# File Validation

Currently supported image types:

    image/jpeg
    image/png
    image/webp

Maximum file size:

    5 MB

Multer configuration:

    limits: {
      fileSize: 5 * 1024 * 1024,
    }

The MIME type is checked using:

    file.mimetype

However, MIME type validation alone is not sufficient for strong production security because the MIME type is provided by the client.

For stronger validation, inspect the actual file contents using a file-signature/content-detection library.

Validation flow:

    Incoming file
         │
         ▼
    Multer fileFilter
         │
         ├── MIME type allowed?
         │       │
         │       └── No → Reject
         │
         ▼
    File content validation
         │
         ├── Actual image?
         │       │
         │       └── No → Reject/Delete
         │
         ▼
    Store file

---

# Multiple Images

A product has:

- One thumbnail
- Zero or more product display images

The Product route uses `upload.fields()`.

    router.post(
      "/products",
      upload.fields([
        {
          name: "thumbnail",
          maxCount: 1,
        },
        {
          name: "productImages",
          maxCount: 10,
        },
      ]),
      productController.create,
    );

Multer provides the files through:

    req.files

The structure is:

    req.files
    │
    ├── thumbnail
    │   └── [File]
    │
    └── productImages
        ├── [File]
        ├── [File]
        └── [File]

---

# Product Controller

Example:

    const files = req.files as {
      thumbnail?: Express.Multer.File[];
      productImages?: Express.Multer.File[];
    };

    const thumbnail = files.thumbnail?.[0];

    const productImages =
      files.productImages ?? [];

Pass the files to the Product service:

    await productService.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      thumbnail,
      productImages,
    });

The controller should primarily handle the HTTP request.

It should not contain detailed file-storage logic.

---

# Product Service

The Product service decides how uploaded images relate to the product.

Conceptually:

    Product
       │
       ├── ProductImage
       │     isThumbnail = true
       │
       ├── ProductImage
       │     isThumbnail = false
       │
       └── ProductImage
             isThumbnail = false

The Product service creates the `ProductImage` database records.

The File service handles physical file operations.

---

# Prisma Models

    model Product {
      productId     Int           @id @default(autoincrement())
      name          String
      description   String
      price         Decimal       @db.Decimal(10, 2)
      createdAt     DateTime      @default(now())
      updatedAt     DateTime      @updatedAt
      isActive      Boolean       @default(true)
      categoryId    Int?

      inventory     Inventory?
      category      Category?     @relation(fields: [categoryId], references: [categoryId], onDelete: Cascade)
      cartItems     CartItem[]
      orderItems    OrderItem[]
      productImages ProductImage[]
    }

    model ProductImage {
      id          Int      @id @default(autoincrement())
      productId   Int
      url         String
      altText     String?
      isThumbnail Boolean  @default(false)
      sortOrder   Int      @default(0)
      createdAt   DateTime @default(now())
      updatedAt   DateTime @updatedAt

      product Product @relation(
        fields: [productId],
        references: [productId],
        onDelete: Cascade
      )

      @@index([productId])
    }

Example:

    Product #1
    │
    ├── ProductImage #1
    │   ├── url = /uploads/abc.jpg
    │   ├── isThumbnail = true
    │   └── sortOrder = 0
    │
    ├── ProductImage #2
    │   ├── url = /uploads/def.jpg
    │   ├── isThumbnail = false
    │   └── sortOrder = 1
    │
    └── ProductImage #3
        ├── url = /uploads/ghi.jpg
        ├── isThumbnail = false
        └── sortOrder = 2

---

# Thumbnail

Each product should have one thumbnail.

The thumbnail is represented by:

    isThumbnail Boolean @default(false)

Example:

    ProductImage #1
    isThumbnail = true

    ProductImage #2
    isThumbnail = false

    ProductImage #3
    isThumbnail = false

The thumbnail can be used for:

- Product cards
- Product listings
- Search results
- Cart previews
- Order summaries

The remaining images can be displayed on the product detail page.

---

# Image Ordering

Product display images should have an explicit order.

Use:

    sortOrder Int @default(0)

Example:

    sortOrder = 0 → front.jpg
    sortOrder = 1 → side.jpg
    sortOrder = 2 → back.jpg

This prevents the frontend from depending on database insertion order.

---

# File Service

## `file.service.ts`

The File service handles operations on stored files.

    import fs from "fs/promises";
    import path from "path";

    class FileService {
      private readonly uploadDirectory =
        "/app/uploads";

      getFileUrl(filename: string): string {
        return `/uploads/${filename}`;
      }

      async deleteFile(
        filename: string,
      ): Promise<void> {
        const filePath = path.join(
          this.uploadDirectory,
          filename,
        );

        try {
          await fs.unlink(filePath);
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            "code" in error &&
            error.code === "ENOENT"
          ) {
            return;
          }

          throw error;
        }
      }

      async fileExists(
        filename: string,
      ): Promise<boolean> {
        const filePath = path.join(
          this.uploadDirectory,
          filename,
        );

        try {
          await fs.access(filePath);
          return true;
        } catch {
          return false;
        }
      }
    }

    export const fileService =
      new FileService();

---

# Serving Uploaded Files

Express exposes the upload directory as static files:

    app.use(
      "/uploads",
      express.static("/app/uploads"),
    );

If the physical file is:

    /app/uploads/550e8400-e29b-41d4-a716-446655440000.jpg

the client can access:

    /uploads/550e8400-e29b-41d4-a716-446655440000.jpg

---

# Database Storage

The database should store a reference to the file rather than the actual image binary.

For example:

    ProductImage
    │
    ├── id
    ├── productId
    ├── url
    ├── isThumbnail
    └── sortOrder

The actual image exists in storage:

    /app/uploads/
        ├── abc.jpg
        ├── def.jpg
        └── ghi.jpg

A more storage-agnostic approach is to store the storage key:

    550e8400-e29b-41d4-a716-446655440000.jpg

and let the File service generate the public URL.

---

# `index.ts`

The File module exposes its public functionality through `index.ts`.

    export { upload } from "./file.config";
    export { fileService } from "./file.service";

Other modules can import:

    import {
      upload,
      fileService,
    } from "../file";

---

# Product Route Integration

The Product module uses the File module:

    import { upload } from "../file";

    router.post(
      "/products",
      upload.fields([
        {
          name: "thumbnail",
          maxCount: 1,
        },
        {
          name: "productImages",
          maxCount: 10,
        },
      ]),
      productController.create,
    );

The File module provides the upload middleware.

The Product module owns the route.

    File Module
        │
        │ provides upload middleware
        ▼
    Product Route
        │
        ▼
    Product Controller
        │
        ▼
    Product Service

---

# Why There Is No `/files` Route

The current application does not need:

    POST /files

because an uploaded image has no independent purpose.

The image exists because the admin is creating or updating a product.

Therefore:

    POST /products
        │
        ├── product data
        ├── thumbnail
        └── productImages[]

is sufficient.

A standalone File API becomes useful when files become independent resources.

Examples:

- Media library
- Reusable images
- Independent file deletion
- Temporary uploads
- Direct cloud uploads
- Upload progress
- Files shared by multiple resources

Until those requirements exist, keeping upload handling inside the Product route is simpler.

---

# Docker Configuration

The backend container should mount the host upload directory.

    backend:
      build:
        context: ./backend
        dockerfile: Dockerfile

      container_name: backend_api

      restart: unless-stopped

      depends_on:
        - postgres

      env_file:
        - ./backend/.env

      ports:
        - "5000:5000"

      volumes:
        - /app/node_modules
        - ./uploads:/app/uploads

      command: npm run dev

This creates:

    Docker container
    /app/uploads
          │
          │ bind mount
          ▼
    Host
    ./uploads

Rebuilding or recreating the backend container will not remove files stored in `./uploads`.

---

# Docker Project Structure

    project/
    ├── backend/
    ├── frontend/
    ├── postgres/
    ├── uploads/
    └── docker-compose.yml

The `uploads/` directory contains runtime/user-generated data.

It should not be committed to Git.

Add:

    uploads/

to `.gitignore`.

---

# Development vs Production

## Development

Use local Docker storage:

    Multer
       ↓
    /app/uploads
       ↓
    Docker bind mount
       ↓
    ./uploads

This is simple and convenient during development.

## Production

A cloud object-storage provider can be used:

    Multer
       ↓
    File Service
       ↓
    Object Storage

The Product module should not need to know whether the file is stored locally or remotely.

---

# Storage Abstraction

A future architecture can abstract the storage implementation:

    File Service
         │
         ▼
    Storage Interface
       /         \
      /           \
     ▼             ▼
    Local Storage  Cloud Storage

Example:

    interface FileStorage {
      save(
        file: Express.Multer.File,
      ): Promise<string>;

      delete(
        key: string,
      ): Promise<void>;

      exists(
        key: string,
      ): Promise<boolean>;

      getUrl(
        key: string,
      ): string;
    }

Possible implementations:

    LocalFileStorage
    S3FileStorage

This allows the storage provider to change without changing Product business logic.

---

# Upload Failure and Cleanup

Multer writes files to disk before the Product service creates the database records.

Therefore, this situation can happen:

    1. Upload image
           ↓
    2. File successfully stored
           ↓
    3. Product database creation fails

The physical file would then exist without a corresponding database record.

The Product creation flow should clean up uploaded files if the database operation fails.

Conceptually:

    Upload files
         │
         ▼
    Create database records
         │
         ├── Success
         │     └── Done
         │
         └── Failure
               │
               ▼
          Delete uploaded files

Example:

    try {
      const product = await createProduct(...);

      return product;
    } catch (error) {
      if (thumbnail) {
        await fileService.deleteFile(
          thumbnail.filename,
        );
      }

      for (const image of productImages) {
        await fileService.deleteFile(
          image.filename,
        );
      }

      throw error;
    }

For larger systems, this can later be replaced with temporary upload storage and a background cleanup process.

---

# Product Deletion

When a product is deleted:

    Product
       │
       ├── ProductImage
       ├── ProductImage
       └── ProductImage

The Prisma relation can use:

    onDelete: Cascade

This deletes the database records.

However, PostgreSQL does not delete physical image files from the filesystem.

Therefore, product deletion should also remove the associated physical files.

Conceptually:

    Delete Product
         │
         ├── Delete ProductImage database records
         │
         └── Delete physical files

The Product service determines which files belong to the product.

The File service performs the physical deletion.

---

# Product Image Update

When an admin replaces an image:

    Old image
        │
        ├── Remove ProductImage record
        └── Delete physical file
                 │
                 ▼
            New image
                 │
                 ├── Store physical file
                 └── Create ProductImage record

The Product module decides which image is being replaced.

The File module handles the physical file operations.

---

# Error Handling

Multer can produce errors such as:

    LIMIT_FILE_SIZE
    LIMIT_FILE_COUNT
    LIMIT_UNEXPECTED_FILE

Example:

    import multer from "multer";

    export function handleUploadError(
      error: unknown,
    ) {
      if (error instanceof multer.MulterError) {
        switch (error.code) {
          case "LIMIT_FILE_SIZE":
            return "File size exceeds the 5 MB limit.";

          case "LIMIT_FILE_COUNT":
            return "Too many files.";

          case "LIMIT_UNEXPECTED_FILE":
            return "Unexpected file field.";

          default:
            return "File upload failed.";
        }
      }

      if (error instanceof Error) {
        return error.message;
      }

      return "File upload failed.";
    }

The exact implementation should follow the application's existing error-handling architecture.

---

# Responsibilities by Module

## File Module

Responsible for:

    How is the file stored?
    How is the filename generated?
    How is the file validated?
    How is the file deleted?
    Where is the file located?
    How is the URL generated?

## Product Module

Responsible for:

    Which files belong to the product?
    Which image is the thumbnail?
    What is the image order?
    When should an image be created?
    When should an image be removed?

## Database

Responsible for:

    Product
    ProductImage
    Relationships
    Image metadata

---

# Overall Architecture

    Frontend
        │
        │ FormData
        │
        ▼
    POST /products
        │
        ▼
    Product Route
        │
        ▼
    Multer Middleware
        │
      ┌─┴───────────────────┐
      │                     │
      ▼                     ▼
    req.body             req.files
                            │
                   ┌────────┴────────┐
                   │                 │
                   ▼                 ▼
               thumbnail       productImages[]
                   │                 │
                   └────────┬────────┘
                            │
                            ▼
                    Product Controller
                            │
                            ▼
                     Product Service
                        │       │
                        │       │
                        ▼       ▼
                    Product  File Service
                        │       │
                        │       ▼
                        │    Storage
                        │       │
                        │       ▼
                        │   ./uploads
                        │
                        ▼
                    PostgreSQL
                        │
                        ▼
                  ProductImage

---

# Design Decisions

## 1. Frontend Does Not Generate Storage Filenames

The frontend sends the original `File`.

The backend generates a UUID:

    randomUUID()

This prevents filename collisions and keeps storage naming under backend control.

---

## 2. Files Are Not Stored in PostgreSQL

The database stores file references and metadata.

The actual image is stored in the filesystem or object storage.

    PostgreSQL
        │
        └── storage key / URL

    Storage
        │
        └── actual image file

---

## 3. Product Owns Image Relationships

`ProductImage` determines:

    productId
    isThumbnail
    sortOrder
    url/storage key
    altText

---

## 4. File Module Owns Storage

The File module determines:

    filename
    storage location
    validation
    deletion
    URL generation

---

## 5. No Standalone File API Initially

Uploading is part of creating a product, so the Product route uses the File module's Multer middleware directly.

A standalone File API should only be introduced when files become an independent resource.

---

## 6. Uploaded Files Are Runtime Data

Uploaded files should not be stored inside:

    backend/src/

Use:

    /app/uploads

inside Docker and mount it to:

    ./uploads

on the host.

---

## 7. Original Filename and Storage Filename Are Different

The original filename:

    my-product-image.jpg

is user-provided.

The storage filename:

    550e8400-e29b-41d4-a716-446655440000.jpg

is generated by the backend.

This prevents:

- Filename collisions
- Unsafe filenames
- Path-related problems
- Clients controlling storage naming

---

# Final Architecture

The File module should be thought of as:

    File Module
        │
        ├── Multer configuration
        ├── File validation
        ├── Filename generation
        ├── File storage
        ├── File deletion
        └── File URL generation

while:

    Product Module
        │
        ├── Product creation
        ├── Thumbnail selection
        ├── Product image management
        └── ProductImage database records

The final relationship is:

    Product Module
          │
          │ "I need to upload product images."
          ▼
    File Module
          │
          ├── Validate
          ├── Generate filename
          ├── Store
          └── Delete

The File module is therefore a reusable infrastructure module, not necessarily a public API resource.
