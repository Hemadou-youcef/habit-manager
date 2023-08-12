/*
  Warnings:

  - You are about to drop the column `goalsPeriodicityValue` on the `habits` table. All the data in the column will be lost.
  - Added the required column `goalsPeriodicityValues` to the `Habits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `habits` DROP COLUMN `goalsPeriodicityValue`,
    ADD COLUMN `goalsPeriodicityValues` VARCHAR(191) NOT NULL;
