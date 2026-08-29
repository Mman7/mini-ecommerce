/*
  Warnings:

  - Made the column `deliveryAddressLine1` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryCity` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryCountry` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryPostcode` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `UserAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "deliveryAddressLine1" SET NOT NULL,
ALTER COLUMN "deliveryCity" SET NOT NULL,
ALTER COLUMN "deliveryCountry" SET NOT NULL,
ALTER COLUMN "deliveryPostcode" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserAddress" ALTER COLUMN "state" SET NOT NULL;
