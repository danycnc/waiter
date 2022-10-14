/*
  Warnings:

  - Made the column `table_id` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_table_id_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "table_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("sessionID") ON DELETE RESTRICT ON UPDATE CASCADE;
