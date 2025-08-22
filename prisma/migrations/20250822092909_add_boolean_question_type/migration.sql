-- CreateTable
CREATE TABLE "BooleanAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" BOOLEAN NOT NULL,
    "answerId" TEXT NOT NULL,
    CONSTRAINT "BooleanAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BooleanAnswer_answerId_key" ON "BooleanAnswer"("answerId");
