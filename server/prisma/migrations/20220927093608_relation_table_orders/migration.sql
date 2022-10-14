/*
  Warnings:

  - A unique constraint covering the columns `[sessionID]` on the table `Table` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `table_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "table_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Table_sessionID_key" ON "Table"("sessionID");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("sessionID") ON DELETE RESTRICT ON UPDATE CASCADE;
