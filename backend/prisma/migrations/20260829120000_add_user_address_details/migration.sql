-- Preserve existing saved addresses while expanding them into structured fields.
ALTER TABLE "UserAddress" RENAME COLUMN "address" TO "addressLine";

ALTER TABLE "UserAddress"
ADD COLUMN "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN "state" TEXT,
ADD COLUMN "postalCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN "country" TEXT NOT NULL DEFAULT '';

ALTER TABLE "UserAddress"
ALTER COLUMN "city" DROP DEFAULT,
ALTER COLUMN "postalCode" DROP DEFAULT,
ALTER COLUMN "country" DROP DEFAULT;