/*
  Warnings:

  - You are about to drop the column `table_id` on the `Order` table. All the data in the column will be lost.
  - Added the required column `sessionID` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_table_id_fkey";

-- DropIndex
DROP INDEX "Table_sessionID_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "table_id",
ADD COLUMN     "sessionID" TEXT NOT NULL;
