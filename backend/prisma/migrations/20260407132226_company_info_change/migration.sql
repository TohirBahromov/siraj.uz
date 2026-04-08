/*
  Warnings:

  - You are about to drop the column `workingHours` on the `CompanyInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CompanyInfo` DROP COLUMN `workingHours`,
    ADD COLUMN `endAt` VARCHAR(191) NOT NULL DEFAULT '18:00',
    ADD COLUMN `endDay` INTEGER NOT NULL DEFAULT 5,
    ADD COLUMN `startAt` VARCHAR(191) NOT NULL DEFAULT '09:00',
    ADD COLUMN `startDay` INTEGER NOT NULL DEFAULT 1;
