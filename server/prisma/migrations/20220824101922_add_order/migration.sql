-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "table" INTEGER NOT NULL,
    "plates_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "cretetedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_plates_id_fkey" FOREIGN KEY ("plates_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
