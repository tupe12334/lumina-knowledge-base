/*
  Warnings:

  - A unique constraint covering the columns `[en_text,he_text]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Translation_en_text_he_text_key" ON "public"."Translation"("en_text", "he_text");
