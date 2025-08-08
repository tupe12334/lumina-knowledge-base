import { describe, expect, it } from 'vitest';
import { PrismaClient } from '../generated/client';

// Normalize data for deterministic snapshotting
const normalize = (value: unknown): unknown => {
  if (value instanceof Date) {
    return new Date(0).toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(normalize);
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = normalize(v);
    }
    return out;
  }
  return value;
};

const fetchAllData = async (prisma: PrismaClient) => ({
  translation: await prisma.translation.findMany({ orderBy: { id: 'asc' } }),
  university: await prisma.university.findMany({ orderBy: { id: 'asc' } }),
  faculty: await prisma.faculty.findMany({ orderBy: { id: 'asc' } }),
  degree: await prisma.degree.findMany({ orderBy: { id: 'asc' } }),
  course: await prisma.course.findMany({ orderBy: { id: 'asc' } }),
  block: await prisma.block.findMany({ orderBy: { id: 'asc' } }),
  blockRelationship: await prisma.blockRelationship.findMany({
    orderBy: { id: 'asc' },
  }),
  relationshipMetadata: await prisma.relationshipMetadata.findMany({
    orderBy: { id: 'asc' },
  }),
  module: await prisma.module.findMany({ orderBy: { id: 'asc' } }),
  question: await prisma.question.findMany({ orderBy: { id: 'asc' } }),
  questionPart: await prisma.questionPart.findMany({ orderBy: { id: 'asc' } }),
  answer: await prisma.answer.findMany({ orderBy: { id: 'asc' } }),
  selectAnswer: await prisma.selectAnswer.findMany({ orderBy: { id: 'asc' } }),
  unitAnswer: await prisma.unitAnswer.findMany({ orderBy: { id: 'asc' } }),
  numberAnswer: await prisma.numberAnswer.findMany({ orderBy: { id: 'asc' } }),
  learningResource: await prisma.learningResource.findMany({
    orderBy: { id: 'asc' },
  }),
});

describe('sqlite db snapshot', () => {
  it('seeds real sqlite DB and matches snapshot', async () => {
    const prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`;

    const data = await fetchAllData(prisma);
    await prisma.$disconnect();

    expect(normalize(data)).toMatchSnapshot();
  }, 120_000);
});
