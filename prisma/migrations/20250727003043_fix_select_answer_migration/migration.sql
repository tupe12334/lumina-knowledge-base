-- Fix SelectAnswer migration: Safely convert text column to translationId reference

-- Step 1: Add translationId column as nullable first
ALTER TABLE "SelectAnswer" ADD COLUMN "translationId" TEXT;

-- Step 2: Create Translation records for each unique text value and update SelectAnswer records
DO $$
DECLARE
    select_answer_record RECORD;
    translation_id TEXT;
BEGIN
    -- Loop through each SelectAnswer record
    FOR select_answer_record IN 
        SELECT id, text FROM "SelectAnswer"
    LOOP
        -- Create a new Translation record for this text
        INSERT INTO "Translation" (id, "createdAt", "updatedAt", en_text, he_text)
        VALUES (
            gen_random_uuid()::TEXT,
            NOW(),
            NOW(),
            select_answer_record.text,
            select_answer_record.text  -- For now, use same text for both languages
        )
        RETURNING id INTO translation_id;
        
        -- Update the SelectAnswer record to reference this translation
        UPDATE "SelectAnswer" 
        SET "translationId" = translation_id
        WHERE id = select_answer_record.id;
    END LOOP;
END $$;

-- Step 3: Make translationId NOT NULL now that all records have values
ALTER TABLE "SelectAnswer" ALTER COLUMN "translationId" SET NOT NULL;

-- Step 4: Add the foreign key constraint
ALTER TABLE "SelectAnswer" ADD CONSTRAINT "SelectAnswer_translationId_fkey" 
    FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 5: Drop the old text column
ALTER TABLE "SelectAnswer" DROP COLUMN "text";
