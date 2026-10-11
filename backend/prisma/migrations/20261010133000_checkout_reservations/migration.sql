CREATE TYPE "CheckoutReservationStatus" AS ENUM ('RESERVED', 'FULFILLED', 'RELEASED');

CREATE TABLE "CheckoutReservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeUserId" TEXT,
    "paymentIntentId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "CheckoutReservationStatus" NOT NULL DEFAULT 'RESERVED',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deliveryAddressLine1" TEXT NOT NULL,
    "deliveryAddressLine2" TEXT,
    "deliveryCity" TEXT NOT NULL,
    "deliveryCountry" TEXT NOT NULL,
    "deliveryName" TEXT,
    "deliveryPostcode" TEXT NOT NULL,
    "deliveryState" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CheckoutReservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CheckoutReservationItem" (
    "id" SERIAL NOT NULL,
    "reservationId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "productImageUrl" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    CONSTRAINT "CheckoutReservationItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CheckoutReservation_activeUserId_key" ON "CheckoutReservation"("activeUserId");
CREATE UNIQUE INDEX "CheckoutReservation_paymentIntentId_key" ON "CheckoutReservation"("paymentIntentId");
CREATE INDEX "CheckoutReservation_status_expiresAt_idx" ON "CheckoutReservation"("status", "expiresAt");
CREATE UNIQUE INDEX "CheckoutReservationItem_reservationId_productId_key" ON "CheckoutReservationItem"("reservationId", "productId");

ALTER TABLE "CheckoutReservation"
ADD CONSTRAINT "CheckoutReservation_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CheckoutReservationItem"
ADD CONSTRAINT "CheckoutReservationItem_reservationId_fkey"
FOREIGN KEY ("reservationId") REFERENCES "CheckoutReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CheckoutReservationItem"
ADD CONSTRAINT "CheckoutReservationItem_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;