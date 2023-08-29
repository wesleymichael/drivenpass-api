/*
  Warnings:

  - You are about to drop the `Wifi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Wifi";

-- CreateTable
CREATE TABLE "wifi" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wifi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wifi" ADD CONSTRAINT "wifi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
