/*
  Warnings:

  - You are about to alter the column `text` on the `todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - Made the column `createdAt` on table `todo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "todo" ALTER COLUMN "text" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "completedAt" SET DATA TYPE TIMESTAMPTZ(6);
