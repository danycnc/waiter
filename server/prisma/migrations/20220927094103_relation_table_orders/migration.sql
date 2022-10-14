-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_table_id_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "table_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("sessionID") ON DELETE SET NULL ON UPDATE CASCADE;
