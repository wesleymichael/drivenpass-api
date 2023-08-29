-- CreateTable
CREATE TABLE "Wifi" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "Wifi_pkey" PRIMARY KEY ("id")
);
