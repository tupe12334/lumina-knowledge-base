-- CreateTable
CREATE TABLE "NumberAnswer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "answerId" TEXT NOT NULL,

    CONSTRAINT "NumberAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NumberAnswer_answerId_key" ON "NumberAnswer"("answerId");

-- AddForeignKey
ALTER TABLE "NumberAnswer" ADD CONSTRAINT "NumberAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
