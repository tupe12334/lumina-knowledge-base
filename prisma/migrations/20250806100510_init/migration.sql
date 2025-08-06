-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "translationId" TEXT NOT NULL,
    CONSTRAINT "University_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "descriptionId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    CONSTRAINT "Faculty_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Faculty_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Faculty_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Degree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "translationId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    CONSTRAINT "Degree_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Degree_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "translationId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "blockId" TEXT NOT NULL,
    CONSTRAINT "Course_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Course_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BlockRelationship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "prerequisiteId" TEXT NOT NULL,
    "postrequisiteId" TEXT NOT NULL,
    CONSTRAINT "BlockRelationship_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Block" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BlockRelationship_postrequisiteId_fkey" FOREIGN KEY ("postrequisiteId") REFERENCES "Block" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RelationshipMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "blockRelationshipId" TEXT NOT NULL,
    CONSTRAINT "RelationshipMetadata_blockRelationshipId_fkey" FOREIGN KEY ("blockRelationshipId") REFERENCES "BlockRelationship" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "translationId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    CONSTRAINT "Module_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Module_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "en_text" TEXT NOT NULL,
    "he_text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "validationStatus" TEXT NOT NULL DEFAULT 'ai_generated',
    "translationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Question_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionPart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "questionId" TEXT NOT NULL,
    "partQuestionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "QuestionPart_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuestionPart_partQuestionId_fkey" FOREIGN KEY ("partQuestionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "questionId" TEXT NOT NULL,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SelectAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "translationId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    CONSTRAINT "SelectAnswer_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SelectAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UnitAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    CONSTRAINT "UnitAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NumberAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    "answerId" TEXT NOT NULL,
    CONSTRAINT "NumberAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "relevance" REAL NOT NULL DEFAULT 0.0,
    "suggestedBy" TEXT,
    CONSTRAINT "LearningResource_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CourseModules" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CourseModules_A_fkey" FOREIGN KEY ("A") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CourseModules_B_fkey" FOREIGN KEY ("B") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CourseToDegree" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CourseToDegree_A_fkey" FOREIGN KEY ("A") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CourseToDegree_B_fkey" FOREIGN KEY ("B") REFERENCES "Degree" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ModuleHierarchy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ModuleHierarchy_A_fkey" FOREIGN KEY ("A") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ModuleHierarchy_B_fkey" FOREIGN KEY ("B") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ModuleToQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ModuleToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ModuleToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_translationId_universityId_key" ON "Faculty"("translationId", "universityId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_translationId_universityId_key" ON "Course"("translationId", "universityId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockRelationship_prerequisiteId_postrequisiteId_key" ON "BlockRelationship"("prerequisiteId", "postrequisiteId");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipMetadata_key_blockRelationshipId_key" ON "RelationshipMetadata"("key", "blockRelationshipId");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_en_text_he_text_key" ON "Translation"("en_text", "he_text");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionPart_questionId_order_key" ON "QuestionPart"("questionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "UnitAnswer_answerId_key" ON "UnitAnswer"("answerId");

-- CreateIndex
CREATE UNIQUE INDEX "NumberAnswer_answerId_key" ON "NumberAnswer"("answerId");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseModules_AB_unique" ON "_CourseModules"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseModules_B_index" ON "_CourseModules"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToDegree_AB_unique" ON "_CourseToDegree"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToDegree_B_index" ON "_CourseToDegree"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ModuleHierarchy_AB_unique" ON "_ModuleHierarchy"("A", "B");

-- CreateIndex
CREATE INDEX "_ModuleHierarchy_B_index" ON "_ModuleHierarchy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ModuleToQuestion_AB_unique" ON "_ModuleToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_ModuleToQuestion_B_index" ON "_ModuleToQuestion"("B");
