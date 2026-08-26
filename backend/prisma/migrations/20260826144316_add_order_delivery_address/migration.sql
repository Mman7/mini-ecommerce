/*
  Warnings:

  - You are about to drop the `UserAddress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `deliveryAddressLine1` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryCountry` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryPostcode` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAddress" DROP CONSTRAINT "UserAddress_userId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryAddressLine1" TEXT NOT NULL,
ADD COLUMN     "deliveryAddressLine2" TEXT,
ADD COLUMN     "deliveryCity" TEXT NOT NULL,
ADD COLUMN     "deliveryCountry" TEXT NOT NULL,
ADD COLUMN     "deliveryName" TEXT,
ADD COLUMN     "deliveryPostcode" TEXT NOT NULL,
ADD COLUMN     "deliveryState" TEXT;

-- DropTable
DROP TABLE "UserAddress";
