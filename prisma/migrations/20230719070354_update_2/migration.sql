/*
  Warnings:

  - You are about to drop the `TagsOnArticles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TagsOnArticles` DROP FOREIGN KEY `TagsOnArticles_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `TagsOnArticles` DROP FOREIGN KEY `TagsOnArticles_tagId_fkey`;

-- DropTable
DROP TABLE `TagsOnArticles`;

-- CreateTable
CREATE TABLE `_ArticleToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ArticleToTag_AB_unique`(`A`, `B`),
    INDEX `_ArticleToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ArticleToTag` ADD CONSTRAINT `_ArticleToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArticleToTag` ADD CONSTRAINT `_ArticleToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
