DO $$
DECLARE
  product_record RECORD;
  base_slug TEXT;
  candidate_slug TEXT;
  suffix INTEGER;
BEGIN
  FOR product_record IN
    SELECT "productId", "name"
    FROM "Product"
    WHERE "slug" IS NULL
    ORDER BY "productId"
  LOOP
    base_slug := trim(both '-' from regexp_replace(
      regexp_replace(lower(product_record."name"), '''', '', 'g'),
      '[^a-z0-9]+', '-', 'g'
    ));

    IF base_slug = '' THEN
      base_slug := 'product-' || product_record."productId";
    END IF;

    candidate_slug := base_slug;
    suffix := 2;
    WHILE EXISTS (SELECT 1 FROM "Product" WHERE "slug" = candidate_slug) LOOP
      candidate_slug := base_slug || '-' || suffix;
      suffix := suffix + 1;
    END LOOP;

    UPDATE "Product"
    SET "slug" = candidate_slug
    WHERE "productId" = product_record."productId";
  END LOOP;
END $$;

ALTER TABLE "Product" ALTER COLUMN "slug" SET NOT NULL;
