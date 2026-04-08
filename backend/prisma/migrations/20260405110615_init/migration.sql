-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `placement` ENUM('SHOWCASE', 'GRID') NOT NULL,
    `badgeColor` VARCHAR(191) NOT NULL,
    `titleColor` VARCHAR(191) NOT NULL,
    `descColor` VARCHAR(191) NOT NULL,
    `btn1Color` VARCHAR(191) NOT NULL,
    `btn1BgColor` VARCHAR(191) NOT NULL,
    `btn2Color` VARCHAR(191) NOT NULL,
    `btn2BgColor` VARCHAR(191) NOT NULL,
    `imgUrl` VARCHAR(191) NOT NULL,
    `backgroundColor` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `locale` VARCHAR(191) NOT NULL,
    `badge` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `desc` TEXT NOT NULL,

    UNIQUE INDEX `ProductTranslation_productId_locale_key`(`productId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductTranslation` ADD CONSTRAINT `ProductTranslation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
