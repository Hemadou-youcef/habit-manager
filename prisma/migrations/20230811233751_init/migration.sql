-- DropForeignKey
ALTER TABLE `habits` DROP FOREIGN KEY `Habits_habitGroupId_fkey`;

-- AlterTable
ALTER TABLE `habits` MODIFY `habitGroupId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Habits` ADD CONSTRAINT `Habits_habitGroupId_fkey` FOREIGN KEY (`habitGroupId`) REFERENCES `HabitsGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
