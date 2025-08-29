import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const logger = new Logger('UUIDValidator');

interface ValidationResult {
  tableName: string;
  invalidCount: number;
  fixedCount: number;
  errors: string[];
}

/**
 * Validates and fixes all UUIDs in the database using only type-safe Prisma operations
 * Since Prisma doesn't allow updating primary keys, we:
 * 1. Create new records with valid UUIDs
 * 2. Update all foreign key references
 * 3. Delete old records
 */
export async function validateAndFixAllDatabaseUUIDs(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult[]> {
  logger.log('Starting database UUID validation (type-safe mode)...');
  const results: ValidationResult[] = [];

  // Check and fix each entity type
  const validationTasks = [
    validateTranslations(prisma, enableMutations),
    validateInstitutions(prisma, enableMutations),
    validateFaculties(prisma, enableMutations),
    validateDegrees(prisma, enableMutations),
    validateCourses(prisma, enableMutations),
    validateBlocks(prisma, enableMutations),
    validateBlockRelationships(prisma, enableMutations),
    validateRelationshipMetadata(prisma, enableMutations),
    validateModules(prisma, enableMutations),
    validateQuestions(prisma, enableMutations),
    validateQuestionParts(prisma, enableMutations),
    validateAnswers(prisma, enableMutations),
    validateSelectAnswers(prisma, enableMutations),
    validateUnitAnswers(prisma, enableMutations),
    validateNumberAnswers(prisma, enableMutations),
    validateBooleanAnswers(prisma, enableMutations),
  ];

  const allResults = await Promise.all(validationTasks);
  results.push(...allResults.filter(r => r.invalidCount > 0));

  // Summary
  const totalInvalid = results.reduce((sum, r) => sum + r.invalidCount, 0);
  const totalFixed = results.reduce((sum, r) => sum + r.fixedCount, 0);

  if (totalInvalid === 0) {
    logger.log('✅ All UUIDs in the database are valid!');
  } else if (enableMutations) {
    logger.log(`✅ Fixed ${totalFixed}/${totalInvalid} invalid UUIDs in the database`);
  } else {
    logger.warn(`⚠️  Found ${totalInvalid} invalid UUIDs in the database (mutations disabled, not fixing)`);
  }

  return results;
}

async function validateTranslations(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'Translation',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const translations = await prisma.translation.findMany();

    for (const translation of translations) {
      if (!uuidValidate(translation.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new translation with valid UUID
              await tx.translation.create({
                data: {
                  id: newId,
                  en_text: translation.en_text,
                  he_text: translation.he_text,
                },
              });

              // Update all references
              await Promise.all([
                tx.institution.updateMany({
                  where: { translationId: translation.id },
                  data: { translationId: newId },
                }),
                tx.faculty.updateMany({
                  where: { translationId: translation.id },
                  data: { translationId: newId },
                }),
                tx.faculty.updateMany({
                  where: { descriptionId: translation.id },
                  data: { descriptionId: newId },
                }),
                tx.degree.updateMany({
                  where: { translationId: translation.id },
                  data: { translationId: newId },
                }),
                tx.course.updateMany({
                  where: { translationId: translation.id },
                  data: { translationId: newId },
                }),
                tx.module.updateMany({
                  where: { translationId: translation.id },
                  data: { translationId: newId },
                }),
                tx.question.updateMany({
                  where: { translationId: translation.id },
                  data: { translationId: newId },
                }),
                tx.selectAnswer.updateMany({
                  where: { translationId: translation.id },
                  data: { translationId: newId },
                }),
              ]);

              // Delete old record
              await tx.translation.delete({
                where: { id: translation.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed Translation UUID: "${translation.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix Translation ${translation.id}: ${error}`);
            logger.error(`Failed to fix Translation ${translation.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in Translation: "${translation.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate Translations: ${error}`);
    logger.error('Failed to validate Translations:', error);
  }

  return result;
}

async function validateInstitutions(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'Institution',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const institutions = await prisma.institution.findMany({
      include: {
        courses: true,
        Degree: true,
        Faculty: true,
      },
    });

    for (const institution of institutions) {
      if (!uuidValidate(institution.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new institution with valid UUID
              await tx.institution.create({
                data: {
                  id: newId,
                  translationId: institution.translationId,
                },
              });

              // Update all references
              await Promise.all([
                tx.faculty.updateMany({
                  where: { institutionId: institution.id },
                  data: { institutionId: newId },
                }),
                tx.degree.updateMany({
                  where: { institutionId: institution.id },
                  data: { institutionId: newId },
                }),
                tx.course.updateMany({
                  where: { institutionId: institution.id },
                  data: { institutionId: newId },
                }),
              ]);

              // Delete old record
              await tx.institution.delete({
                where: { id: institution.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed Institution UUID: "${institution.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix Institution ${institution.id}: ${error}`);
            logger.error(`Failed to fix Institution ${institution.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in Institution: "${institution.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate Institutions: ${error}`);
    logger.error('Failed to validate Institutions:', error);
  }

  return result;
}

async function validateFaculties(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'Faculty',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const faculties = await prisma.faculty.findMany();

    for (const faculty of faculties) {
      if (!uuidValidate(faculty.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new faculty with valid UUID
              await tx.faculty.create({
                data: {
                  id: newId,
                  translationId: faculty.translationId,
                  descriptionId: faculty.descriptionId,
                  institutionId: faculty.institutionId,
                },
              });

              // Update all references
              await tx.degree.updateMany({
                where: { facultyId: faculty.id },
                data: { facultyId: newId },
              });

              // Delete old record
              await tx.faculty.delete({
                where: { id: faculty.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed Faculty UUID: "${faculty.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix Faculty ${faculty.id}: ${error}`);
            logger.error(`Failed to fix Faculty ${faculty.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in Faculty: "${faculty.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate Faculties: ${error}`);
    logger.error('Failed to validate Faculties:', error);
  }

  return result;
}

// Similar implementations for other entities...
// For brevity, I'll implement a few more key ones

async function validateBlocks(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'Block',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const blocks = await prisma.block.findMany();

    for (const block of blocks) {
      if (!uuidValidate(block.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new block with valid UUID
              await tx.block.create({
                data: {
                  id: newId,
                },
              });

              // Update all references
              await Promise.all([
                tx.course.updateMany({
                  where: { blockId: block.id },
                  data: { blockId: newId },
                }),
                tx.module.updateMany({
                  where: { blockId: block.id },
                  data: { blockId: newId },
                }),
                tx.blockRelationship.updateMany({
                  where: { prerequisiteId: block.id },
                  data: { prerequisiteId: newId },
                }),
                tx.blockRelationship.updateMany({
                  where: { postrequisiteId: block.id },
                  data: { postrequisiteId: newId },
                }),
              ]);

              // Delete old record
              await tx.block.delete({
                where: { id: block.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed Block UUID: "${block.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix Block ${block.id}: ${error}`);
            logger.error(`Failed to fix Block ${block.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in Block: "${block.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate Blocks: ${error}`);
    logger.error('Failed to validate Blocks:', error);
  }

  return result;
}

async function validateQuestions(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'Question',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const questions = await prisma.question.findMany({
      include: {
        Modules: true,
        Parts: true,
        PartOf: true,
      },
    });

    for (const question of questions) {
      if (!uuidValidate(question.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new question with valid UUID
              await tx.question.create({
                data: {
                  id: newId,
                  validationStatus: question.validationStatus,
                  translationId: question.translationId,
                  type: question.type,
                  Modules: {
                    connect: question.Modules.map(m => ({ id: m.id })),
                  },
                },
              });

              // Update all references
              await Promise.all([
                tx.answer.updateMany({
                  where: { questionId: question.id },
                  data: { questionId: newId },
                }),
                tx.questionPart.updateMany({
                  where: { questionId: question.id },
                  data: { questionId: newId },
                }),
                tx.questionPart.updateMany({
                  where: { partQuestionId: question.id },
                  data: { partQuestionId: newId },
                }),
              ]);

              // Delete old record
              await tx.question.delete({
                where: { id: question.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed Question UUID: "${question.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix Question ${question.id}: ${error}`);
            logger.error(`Failed to fix Question ${question.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in Question: "${question.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate Questions: ${error}`);
    logger.error('Failed to validate Questions:', error);
  }

  return result;
}

async function validateDegrees(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'Degree',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const degrees = await prisma.degree.findMany({
      include: {
        courses: true,
      },
    });

    for (const degree of degrees) {
      if (!uuidValidate(degree.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new degree with valid UUID
              await tx.degree.create({
                data: {
                  id: newId,
                  translationId: degree.translationId,
                  facultyId: degree.facultyId,
                  institutionId: degree.institutionId,
                },
              });

              // Update many-to-many relationship with courses
              const courseConnections = degree.courses.map(course => ({ id: course.id }));
              if (courseConnections.length > 0) {
                await tx.degree.update({
                  where: { id: newId },
                  data: {
                    courses: {
                      connect: courseConnections,
                    },
                  },
                });
              }

              // Delete old record
              await tx.degree.delete({
                where: { id: degree.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed Degree UUID: "${degree.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix Degree ${degree.id}: ${error}`);
            logger.error(`Failed to fix Degree ${degree.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in Degree: "${degree.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate Degrees: ${error}`);
    logger.error('Failed to validate Degrees:', error);
  }

  return result;
}

async function validateCourses(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'Course',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const courses = await prisma.course.findMany({
      include: {
        Degree: true,
        modules: true,
      },
    });

    for (const course of courses) {
      if (!uuidValidate(course.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new course with valid UUID
              await tx.course.create({
                data: {
                  id: newId,
                  translationId: course.translationId,
                  institutionId: course.institutionId,
                  blockId: course.blockId,
                  publishedAt: course.publishedAt,
                },
              });

              // Update many-to-many relationships
              const degreeConnections = course.Degree.map(degree => ({ id: degree.id }));
              const moduleConnections = course.modules.map(module => ({ id: module.id }));

              if (degreeConnections.length > 0 || moduleConnections.length > 0) {
                await tx.course.update({
                  where: { id: newId },
                  data: {
                    ...(degreeConnections.length > 0 && {
                      degrees: { connect: degreeConnections },
                    }),
                    ...(moduleConnections.length > 0 && {
                      modules: { connect: moduleConnections },
                    }),
                  },
                });
              }

              // Delete old record
              await tx.course.delete({
                where: { id: course.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed Course UUID: "${course.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix Course ${course.id}: ${error}`);
            logger.error(`Failed to fix Course ${course.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in Course: "${course.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate Courses: ${error}`);
    logger.error('Failed to validate Courses:', error);
  }

  return result;
}

async function validateBlockRelationships(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'BlockRelationship',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const relationships = await prisma.blockRelationship.findMany({
      include: {
        metadata: true,
      },
    });

    for (const relationship of relationships) {
      if (!uuidValidate(relationship.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new relationship with valid UUID
              await tx.blockRelationship.create({
                data: {
                  id: newId,
                  prerequisiteId: relationship.prerequisiteId,
                  postrequisiteId: relationship.postrequisiteId,
                },
              });

              // Update metadata references
              await tx.relationshipMetadata.updateMany({
                where: { blockRelationshipId: relationship.id },
                data: { blockRelationshipId: newId },
              });

              // Delete old record
              await tx.blockRelationship.delete({
                where: { id: relationship.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed BlockRelationship UUID: "${relationship.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix BlockRelationship ${relationship.id}: ${error}`);
            logger.error(`Failed to fix BlockRelationship ${relationship.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in BlockRelationship: "${relationship.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate BlockRelationships: ${error}`);
    logger.error('Failed to validate BlockRelationships:', error);
  }

  return result;
}

async function validateRelationshipMetadata(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'RelationshipMetadata',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const metadata = await prisma.relationshipMetadata.findMany();

    for (const meta of metadata) {
      if (!uuidValidate(meta.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new metadata with valid UUID
              await tx.relationshipMetadata.create({
                data: {
                  id: newId,
                  key: meta.key,
                  value: meta.value,
                  blockRelationshipId: meta.blockRelationshipId,
                },
              });

              // Delete old record
              await tx.relationshipMetadata.delete({
                where: { id: meta.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed RelationshipMetadata UUID: "${meta.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix RelationshipMetadata ${meta.id}: ${error}`);
            logger.error(`Failed to fix RelationshipMetadata ${meta.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in RelationshipMetadata: "${meta.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate RelationshipMetadata: ${error}`);
    logger.error('Failed to validate RelationshipMetadata:', error);
  }

  return result;
}

async function validateModules(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'Module',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const modules = await prisma.module.findMany({
      include: {
        Course: true,
        Questions: true,
        parentModules: true,
        subModules: true,
      },
    });

    for (const module of modules) {
      if (!uuidValidate(module.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new module with valid UUID
              await tx.module.create({
                data: {
                  id: newId,
                  translationId: module.translationId,
                  blockId: module.blockId,
                },
              });

              // Update many-to-many relationships
              const courseConnections = module.Course.map(course => ({ id: course.id }));
              const questionConnections = module.Questions.map(q => ({ id: q.id }));
              const parentConnections = module.parentModules.map(p => ({ id: p.id }));
              const subConnections = module.subModules.map(s => ({ id: s.id }));

              if (courseConnections.length > 0 || questionConnections.length > 0 ||
                  parentConnections.length > 0 || subConnections.length > 0) {
                await tx.module.update({
                  where: { id: newId },
                  data: {
                    ...(courseConnections.length > 0 && {
                      Course: { connect: courseConnections },
                    }),
                    ...(questionConnections.length > 0 && {
                      Questions: { connect: questionConnections },
                    }),
                    ...(parentConnections.length > 0 && {
                      parentModules: { connect: parentConnections },
                    }),
                    ...(subConnections.length > 0 && {
                      subModules: { connect: subConnections },
                    }),
                  },
                });
              }

              // Delete old record
              await tx.module.delete({
                where: { id: module.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed Module UUID: "${module.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix Module ${module.id}: ${error}`);
            logger.error(`Failed to fix Module ${module.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in Module: "${module.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate Modules: ${error}`);
    logger.error('Failed to validate Modules:', error);
  }

  return result;
}

async function validateQuestionParts(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'QuestionPart',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const questionParts = await prisma.questionPart.findMany();

    for (const part of questionParts) {
      if (!uuidValidate(part.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new question part with valid UUID
              await tx.questionPart.create({
                data: {
                  id: newId,
                  questionId: part.questionId,
                  partQuestionId: part.partQuestionId,
                  order: part.order,
                },
              });

              // Delete old record
              await tx.questionPart.delete({
                where: { id: part.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed QuestionPart UUID: "${part.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix QuestionPart ${part.id}: ${error}`);
            logger.error(`Failed to fix QuestionPart ${part.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in QuestionPart: "${part.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate QuestionParts: ${error}`);
    logger.error('Failed to validate QuestionParts:', error);
  }

  return result;
}

async function validateAnswers(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'Answer',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const answers = await prisma.answer.findMany({
      include: {
        SelectAnswer: true,
        UnitAnswer: true,
        NumberAnswer: true,
        BooleanAnswer: true,
      },
    });

    for (const answer of answers) {
      if (!uuidValidate(answer.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new answer with valid UUID
              await tx.answer.create({
                data: {
                  id: newId,
                  questionId: answer.questionId,
                },
              });

              // Update all answer type references
              if (answer.SelectAnswer) {
                await tx.selectAnswer.updateMany({
                  where: { answerId: answer.id },
                  data: { answerId: newId },
                });
              }
              if (answer.UnitAnswer) {
                await tx.unitAnswer.updateMany({
                  where: { answerId: answer.id },
                  data: { answerId: newId },
                });
              }
              if (answer.NumberAnswer) {
                await tx.numberAnswer.updateMany({
                  where: { answerId: answer.id },
                  data: { answerId: newId },
                });
              }
              if (answer.BooleanAnswer) {
                await tx.booleanAnswer.updateMany({
                  where: { answerId: answer.id },
                  data: { answerId: newId },
                });
              }

              // Delete old record
              await tx.answer.delete({
                where: { id: answer.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed Answer UUID: "${answer.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix Answer ${answer.id}: ${error}`);
            logger.error(`Failed to fix Answer ${answer.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in Answer: "${answer.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate Answers: ${error}`);
    logger.error('Failed to validate Answers:', error);
  }

  return result;
}

async function validateSelectAnswers(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'SelectAnswer',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const selectAnswers = await prisma.selectAnswer.findMany();

    for (const selectAnswer of selectAnswers) {
      if (!uuidValidate(selectAnswer.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new select answer with valid UUID
              await tx.selectAnswer.create({
                data: {
                  id: newId,
                  translationId: selectAnswer.translationId,
                  isCorrect: selectAnswer.isCorrect,
                  answerId: selectAnswer.answerId,
                },
              });

              // Delete old record
              await tx.selectAnswer.delete({
                where: { id: selectAnswer.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed SelectAnswer UUID: "${selectAnswer.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix SelectAnswer ${selectAnswer.id}: ${error}`);
            logger.error(`Failed to fix SelectAnswer ${selectAnswer.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in SelectAnswer: "${selectAnswer.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate SelectAnswers: ${error}`);
    logger.error('Failed to validate SelectAnswers:', error);
  }

  return result;
}

async function validateUnitAnswers(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'UnitAnswer',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const unitAnswers = await prisma.unitAnswer.findMany();

    for (const unitAnswer of unitAnswers) {
      if (!uuidValidate(unitAnswer.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new unit answer with valid UUID
              await tx.unitAnswer.create({
                data: {
                  id: newId,
                  value: unitAnswer.value,
                  unit: unitAnswer.unit,
                  answerId: unitAnswer.answerId,
                },
              });

              // Delete old record
              await tx.unitAnswer.delete({
                where: { id: unitAnswer.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed UnitAnswer UUID: "${unitAnswer.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix UnitAnswer ${unitAnswer.id}: ${error}`);
            logger.error(`Failed to fix UnitAnswer ${unitAnswer.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in UnitAnswer: "${unitAnswer.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate UnitAnswers: ${error}`);
    logger.error('Failed to validate UnitAnswers:', error);
  }

  return result;
}

async function validateNumberAnswers(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'NumberAnswer',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const numberAnswers = await prisma.numberAnswer.findMany();

    for (const numberAnswer of numberAnswers) {
      if (!uuidValidate(numberAnswer.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new number answer with valid UUID
              await tx.numberAnswer.create({
                data: {
                  id: newId,
                  value: numberAnswer.value,
                  answerId: numberAnswer.answerId,
                },
              });

              // Delete old record
              await tx.numberAnswer.delete({
                where: { id: numberAnswer.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed NumberAnswer UUID: "${numberAnswer.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix NumberAnswer ${numberAnswer.id}: ${error}`);
            logger.error(`Failed to fix NumberAnswer ${numberAnswer.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in NumberAnswer: "${numberAnswer.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate NumberAnswers: ${error}`);
    logger.error('Failed to validate NumberAnswers:', error);
  }

  return result;
}

async function validateBooleanAnswers(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult> {
  const result: ValidationResult = {
    tableName: 'BooleanAnswer',
    invalidCount: 0,
    fixedCount: 0,
    errors: [],
  };

  try {
    const booleanAnswers = await prisma.booleanAnswer.findMany();

    for (const booleanAnswer of booleanAnswers) {
      if (!uuidValidate(booleanAnswer.id)) {
        result.invalidCount++;

        if (enableMutations) {
          try {
            const newId = uuidv4();

            await prisma.$transaction(async (tx) => {
              // Create new boolean answer with valid UUID
              await tx.booleanAnswer.create({
                data: {
                  id: newId,
                  value: booleanAnswer.value,
                  answerId: booleanAnswer.answerId,
                },
              });

              // Delete old record
              await tx.booleanAnswer.delete({
                where: { id: booleanAnswer.id },
              });
            });

            result.fixedCount++;
            logger.log(`Fixed BooleanAnswer UUID: "${booleanAnswer.id}" → "${newId}"`);
          } catch (error) {
            result.errors.push(`Failed to fix BooleanAnswer ${booleanAnswer.id}: ${error}`);
            logger.error(`Failed to fix BooleanAnswer ${booleanAnswer.id}:`, error);
          }
        } else {
          logger.warn(`Invalid UUID in BooleanAnswer: "${booleanAnswer.id}"`);
        }
      }
    }
  } catch (error) {
    result.errors.push(`Failed to validate BooleanAnswers: ${error}`);
    logger.error('Failed to validate BooleanAnswers:', error);
  }

  return result;
}