/*
  Warnings:

  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `transaction` MODIFY `typeOfTransaction` VARCHAR(255) NOT NULL DEFAULT 'NULL';

-- DropTable
DROP TABLE `token`;

-- CreateTable
CREATE TABLE `Conclave` (
    `id` VARCHAR(191) NOT NULL DEFAULT '',
    `active` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Conclave_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
