/*
  Warnings:

  - You are about to drop the column `accentColor` on the `HeroSlide` table. All the data in the column will be lost.
  - You are about to drop the column `gradient` on the `HeroSlide` table. All the data in the column will be lost.
  - You are about to drop the column `primaryHref` on the `HeroSlide` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryHref` on the `HeroSlide` table. All the data in the column will be lost.
  - You are about to drop the column `primaryCta` on the `HeroSlideTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryCta` on the `HeroSlideTranslation` table. All the data in the column will be lost.
  - Added the required column `eyebrowColor` to the `HeroSlide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headlineColor` to the `HeroSlide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sublineColor` to the `HeroSlide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HeroSlide` DROP COLUMN `accentColor`,
    DROP COLUMN `gradient`,
    DROP COLUMN `primaryHref`,
    DROP COLUMN `secondaryHref`,
    ADD COLUMN `eyebrowColor` VARCHAR(191) NOT NULL,
    ADD COLUMN `headlineColor` VARCHAR(191) NOT NULL,
    ADD COLUMN `sublineColor` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `HeroSlideTranslation` DROP COLUMN `primaryCta`,
    DROP COLUMN `secondaryCta`;
