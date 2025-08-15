-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Degree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "translationId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "facultyId" TEXT,
    CONSTRAINT "Degree_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Degree_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Degree_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Degree" ("id", "translationId", "universityId") SELECT "id", "translationId", "universityId" FROM "Degree";
DROP TABLE "Degree";
ALTER TABLE "new_Degree" RENAME TO "Degree";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
