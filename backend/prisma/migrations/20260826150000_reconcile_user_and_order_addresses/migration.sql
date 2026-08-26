-- Recreate the relational user address table after the previous migration removed it.
CREATE TABLE "UserAddress" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "UserAddress"
  ADD CONSTRAINT "UserAddress_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Order"
  ALTER COLUMN "deliveryAddressLine1" DROP NOT NULL,
  ALTER COLUMN "deliveryCity" DROP NOT NULL,
  ALTER COLUMN "deliveryPostcode" DROP NOT NULL,
  ALTER COLUMN "deliveryCountry" DROP NOT NULL;