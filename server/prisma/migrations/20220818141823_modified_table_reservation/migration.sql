/*
  Warnings:

  - You are about to drop the column `status` on the `Table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Table" DROP COLUMN "status",
ADD COLUMN     "reserved" BOOLEAN NOT NULL DEFAULT false;
