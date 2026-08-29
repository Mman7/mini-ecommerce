ALTER TABLE "Order"
	ALTER COLUMN "deliveryAddressLine1" DROP NOT NULL,
	ALTER COLUMN "deliveryCity" DROP NOT NULL,
	ALTER COLUMN "deliveryPostcode" DROP NOT NULL,
	ALTER COLUMN "deliveryCountry" DROP NOT NULL;