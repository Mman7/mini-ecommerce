ALTER TABLE "OrderItem"
ADD COLUMN "productName" TEXT,
ADD COLUMN "productSlug" TEXT,
ADD COLUMN "productImageUrl" TEXT;

UPDATE "OrderItem" AS item
SET
  "productName" = COALESCE(product."name", 'Removed product'),
  "productSlug" = COALESCE(product."slug", 'removed-product-' || item."productId"::TEXT),
  "productImageUrl" = image."url"
FROM "Product" AS product
LEFT JOIN LATERAL (
  SELECT "url"
  FROM "ProductImage"
  WHERE "productId" = product."productId"
  ORDER BY "isThumbnail" DESC, "sortOrder" ASC, "id" ASC
  LIMIT 1
) AS image ON TRUE
WHERE item."productId" = product."productId";

UPDATE "OrderItem"
SET
  "productName" = COALESCE("productName", 'Removed product'),
  "productSlug" = COALESCE("productSlug", 'removed-product-' || "productId"::TEXT)
WHERE "productName" IS NULL OR "productSlug" IS NULL;

ALTER TABLE "OrderItem"
ALTER COLUMN "productName" SET NOT NULL,
ALTER COLUMN "productSlug" SET NOT NULL;

ALTER TABLE "OrderItem"
DROP CONSTRAINT "OrderItem_productId_fkey";

ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("productId")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Product"
DROP CONSTRAINT "Product_categoryId_fkey";

ALTER TABLE "Product"
ADD CONSTRAINT "Product_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId")
ON DELETE SET NULL ON UPDATE CASCADE;