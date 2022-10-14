-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "sessionID" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "pax" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);
