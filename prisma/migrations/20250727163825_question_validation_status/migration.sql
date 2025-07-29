-- CreateEnum
CREATE TYPE "QuestionValidationStatus" AS ENUM ('ai_generated', 'in_manual_review', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "validationStatus" "QuestionValidationStatus" NOT NULL DEFAULT 'ai_generated';
