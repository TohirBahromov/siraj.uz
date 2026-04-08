-- CreateTable
CREATE TABLE `HeroSlide` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `primaryHref` VARCHAR(191) NOT NULL,
    `secondaryHref` VARCHAR(191) NOT NULL,
    `gradient` VARCHAR(191) NOT NULL,
    `accentColor` VARCHAR(191) NOT NULL,
    `videoSrc` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HeroSlideTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heroSlideId` INTEGER NOT NULL,
    `locale` VARCHAR(191) NOT NULL,
    `eyebrow` VARCHAR(191) NOT NULL,
    `headline` TEXT NOT NULL,
    `subline` TEXT NOT NULL,
    `primaryCta` VARCHAR(191) NOT NULL,
    `secondaryCta` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `HeroSlideTranslation_heroSlideId_locale_key`(`heroSlideId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HeroSlideTranslation` ADD CONSTRAINT `HeroSlideTranslation_heroSlideId_fkey` FOREIGN KEY (`heroSlideId`) REFERENCES `HeroSlide`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
