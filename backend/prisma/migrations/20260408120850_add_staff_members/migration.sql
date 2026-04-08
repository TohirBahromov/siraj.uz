-- CreateTable
CREATE TABLE `StaffMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageUrl` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffMemberTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `staffMemberId` INTEGER NOT NULL,
    `locale` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StaffMemberTranslation_staffMemberId_locale_key`(`staffMemberId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StaffMemberTranslation` ADD CONSTRAINT `StaffMemberTranslation_staffMemberId_fkey` FOREIGN KEY (`staffMemberId`) REFERENCES `StaffMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
