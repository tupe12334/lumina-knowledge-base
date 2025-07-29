/*
  Warnings:

  - Added the required column `partQuestionId` to the `QuestionPart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionPart" ADD COLUMN     "partQuestionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QuestionPart" ADD CONSTRAINT "QuestionPart_partQuestionId_fkey" FOREIGN KEY ("partQuestionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
