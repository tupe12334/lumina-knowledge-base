#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TranslationIssue {
  id: string;
  type: 'missing_translation' | 'duplicate_text';
  language: 'en' | 'he' | 'both';
  details: string;
  en_text: string;
  he_text: string;
}

interface DuplicateTranslation {
  text: string;
  language: 'en' | 'he';
  ids: string[];
}

async function checkMissingTranslations(): Promise<TranslationIssue[]> {
  console.log('🔍 Checking for translation issues...\n');

  const translations = await prisma.translation.findMany();
  const issues: TranslationIssue[] = [];

  console.log(`Found ${translations.length} translation records\n`);

  // Check for missing translations (empty or null values)
  for (const translation of translations) {
    const { id, en_text, he_text } = translation;

    // Check for missing English translation
    if (!en_text || en_text.trim() === '') {
      issues.push({
        id,
        type: 'missing_translation',
        language: 'en',
        details: 'Missing English translation',
        en_text: en_text || '',
        he_text: he_text || '',
      });
    }

    // Check for missing Hebrew translation
    if (!he_text || he_text.trim() === '') {
      issues.push({
        id,
        type: 'missing_translation',
        language: 'he',
        details: 'Missing Hebrew translation',
        en_text: en_text || '',
        he_text: he_text || '',
      });
    }

    // Check for identical text in both languages (potential untranslated content)
    if (
      en_text &&
      he_text &&
      en_text.trim() === he_text.trim() &&
      en_text.trim() !== ''
    ) {
      issues.push({
        id,
        type: 'duplicate_text',
        language: 'both',
        details: 'Same text in both languages - possible untranslated content',
        en_text,
        he_text,
      });
    }
  }

  return issues;
}

async function findDuplicateTranslations(): Promise<DuplicateTranslation[]> {
  console.log('🔍 Checking for duplicate translations...\n');

  const translations = await prisma.translation.findMany();
  const duplicates: DuplicateTranslation[] = [];

  // Group by English text
  const enTextMap = new Map<string, string[]>();
  // Group by Hebrew text
  const heTextMap = new Map<string, string[]>();

  for (const translation of translations) {
    const { id, en_text, he_text } = translation;

    if (en_text && en_text.trim() !== '') {
      const key = en_text.trim().toLowerCase();
      if (!enTextMap.has(key)) {
        enTextMap.set(key, []);
      }
      enTextMap.get(key)!.push(id);
    }

    if (he_text && he_text.trim() !== '') {
      const key = he_text.trim().toLowerCase();
      if (!heTextMap.has(key)) {
        heTextMap.set(key, []);
      }
      heTextMap.get(key)!.push(id);
    }
  }

  // Find English duplicates
  for (const [text, ids] of enTextMap.entries()) {
    if (ids.length > 1) {
      duplicates.push({ text, language: 'en', ids });
    }
  }

  // Find Hebrew duplicates
  for (const [text, ids] of heTextMap.entries()) {
    if (ids.length > 1) {
      duplicates.push({ text, language: 'he', ids });
    }
  }

  return duplicates;
}

async function getRelatedEntities(translationId: string) {
  try {
    const [
      institutions,
      courses,
      modules,
      questions,
      degrees,
      facultyNames,
      facultyDescriptions,
      selectAnswers,
    ] = await Promise.all([
      prisma.institution.findMany({ where: { translationId } }),
      prisma.course.findMany({ where: { translationId } }),
      prisma.module.findMany({ where: { translationId } }),
      prisma.question.findMany({ where: { translationId } }),
      prisma.degree.findMany({ where: { translationId } }),
      prisma.faculty.findMany({ where: { translationId } }),
      prisma.faculty.findMany({ where: { descriptionId: translationId } }),
      prisma.selectAnswer.findMany({ where: { translationId } }),
    ]);

    const relations = [];
    if (institutions.length > 0) {
      relations.push(`Institution: ${institutions.map((i) => i.id).join(', ')}`);
    }
    if (courses.length > 0) {
      relations.push(`Course: ${courses.map((c) => c.id).join(', ')}`);
    }
    if (modules.length > 0) {
      relations.push(`Module: ${modules.map((m) => m.id).join(', ')}`);
    }
    if (questions.length > 0) {
      relations.push(`Question: ${questions.map((q) => q.id).join(', ')}`);
    }
    if (degrees.length > 0) {
      relations.push(`Degree: ${degrees.map((d) => d.id).join(', ')}`);
    }
    if (facultyNames.length > 0) {
      relations.push(`Faculty Name: ${facultyNames.map((f) => f.id).join(', ')}`);
    }
    if (facultyDescriptions.length > 0) {
      relations.push(
        `Faculty Description: ${facultyDescriptions.map((f) => f.id).join(', ')}`,
      );
    }
    if (selectAnswers.length > 0) {
      relations.push(
        `Select Answer: ${selectAnswers.map((a) => a.id).join(', ')}`,
      );
    }

    return relations;
  } catch (error) {
    console.error(`Error getting relations for ${translationId}:`, error);
    return ['Error fetching relations'];
  }
}

async function main() {
  try {
    console.log('🌐 Translation Issues Report');
    console.log('='.repeat(50));

    // Check for missing translations and duplicate text
    const issues = await checkMissingTranslations();

    if (issues.length === 0) {
      console.log('✅ No missing translations or duplicate text found!');
    } else {
      console.log(`❌ Found ${issues.length} translation issues:\n`);

      const missingTranslations = issues.filter(
        (i) => i.type === 'missing_translation',
      );
      const duplicateText = issues.filter((i) => i.type === 'duplicate_text');

      if (missingTranslations.length > 0) {
        console.log(`📝 Missing Translations (${missingTranslations.length}):`);
        console.log('-'.repeat(40));

        for (const issue of missingTranslations) {
          const relations = await getRelatedEntities(issue.id);
          console.log(`ID: ${issue.id}`);
          console.log(
            `Missing: ${issue.language === 'en' ? 'English' : 'Hebrew'} translation`,
          );
          console.log(`EN: "${issue.en_text}"`);
          console.log(`HE: "${issue.he_text}"`);
          if (relations.length > 0) {
            console.log(`Used in: ${relations.join(', ')}`);
          }
          console.log('');
        }
      }

      if (duplicateText.length > 0) {
        console.log(`🔄 Duplicate Text Issues (${duplicateText.length}):`);
        console.log('-'.repeat(40));

        for (const issue of duplicateText) {
          const relations = await getRelatedEntities(issue.id);
          console.log(`ID: ${issue.id}`);
          console.log(`Issue: ${issue.details}`);
          console.log(`Text: "${issue.en_text}"`);
          if (relations.length > 0) {
            console.log(`Used in: ${relations.join(', ')}`);
          }
          console.log('');
        }
      }
    }

    // Check for duplicate translations across different records
    const duplicates = await findDuplicateTranslations();

    if (duplicates.length > 0) {
      console.log(
        `🔍 Duplicate Translations Across Records (${duplicates.length}):`,
      );
      console.log('-'.repeat(50));

      for (const duplicate of duplicates) {
        console.log(`Language: ${duplicate.language.toUpperCase()}`);
        console.log(`Text: "${duplicate.text}"`);
        console.log(`Found in translation IDs: ${duplicate.ids.join(', ')}`);
        console.log('');
      }
    } else {
      console.log(
        '✅ No duplicate translations across different records found!',
      );
    }

    console.log('\n📊 Summary:');
    console.log(
      `- Missing translations: ${issues.filter((i) => i.type === 'missing_translation').length}`,
    );
    console.log(
      `- Duplicate text in same record: ${issues.filter((i) => i.type === 'duplicate_text').length}`,
    );
    console.log(`- Duplicate translations across records: ${duplicates.length}`);

  } catch (error) {
    console.error('Error checking translations:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  void main();
}