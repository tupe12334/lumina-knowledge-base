/*
  Warnings:

  - You are about to drop the column `disciplineId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `disciplineId` on the `Degree` table. All the data in the column will be lost.
  - You are about to drop the `Discipline` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Course" DROP CONSTRAINT "Course_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Degree" DROP CONSTRAINT "Degree_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Discipline" DROP CONSTRAINT "Discipline_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Discipline" DROP CONSTRAINT "Discipline_translationId_fkey";

-- AlterTable
ALTER TABLE "public"."Course" DROP COLUMN "disciplineId";

-- AlterTable
ALTER TABLE "public"."Degree" DROP COLUMN "disciplineId";

-- DropTable
DROP TABLE "public"."Discipline";
