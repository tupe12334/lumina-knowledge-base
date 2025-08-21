/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslationsService } from './translations.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TranslationsService', () => {
  let service: TranslationsService;
  let prisma: PrismaService; // mocked PrismaService

  beforeEach(() => {
    // Mock PrismaService API used by TranslationsService
    prisma = {
      translation: {
        create: vi.fn(),
        createMany: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as PrismaService;

    // Instantiate service directly with mocked prisma
    service = new TranslationsService(prisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a translation', async () => {
      const createTranslationInput = { en_text: 'Hello', he_text: 'שלום' };
      const expectedTranslation = {
        id: 'some-uuid',
        ...createTranslationInput,
      };
      vi.spyOn(prisma.translation, 'create').mockResolvedValue(
        expectedTranslation,
      );

      await expect(service.create(createTranslationInput)).resolves.toEqual(
        expectedTranslation,
      );
      expect(prisma.translation.create).toHaveBeenCalledWith({
        data: createTranslationInput,
      });
    });
  });

  describe('createMany', () => {
    it('should create multiple translations', async () => {
      const createManyInput = {
        translations: [
          { en_text: 'Hello', he_text: 'שלום' },
          { en_text: 'World', he_text: 'עולם' },
        ],
      };
      const expectedResult = { count: 2 };
      vi.spyOn(prisma.translation, 'createMany').mockResolvedValue(
        expectedResult,
      );

      await expect(service.createMany(createManyInput)).resolves.toEqual(
        expectedResult,
      );
      expect(prisma.translation.createMany).toHaveBeenCalledWith({
        data: createManyInput.translations,
        skipDuplicates: true,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of translations', async () => {
      const expectedTranslations = [
        { id: 'uuid1', en_text: 'Hello', he_text: 'שלום' },
        { id: 'uuid2', en_text: 'World', he_text: 'עולם' },
      ];
      vi.spyOn(prisma.translation, 'findMany').mockResolvedValue(
        expectedTranslations,
      );

      await expect(service.findAll()).resolves.toEqual(expectedTranslations);
      expect(prisma.translation.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single translation', async () => {
      const id = 'some-uuid';
      const expectedTranslation = { id, en_text: 'Hello', he_text: 'שלום' };
      vi.spyOn(prisma.translation, 'findUnique').mockResolvedValue(
        expectedTranslation,
      );

      await expect(service.findOne(id)).resolves.toEqual(expectedTranslation);
      expect(prisma.translation.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should return null if translation not found', async () => {
      const id = 'non-existent-uuid';
      vi.spyOn(prisma.translation, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(id)).resolves.toBeNull();
      expect(prisma.translation.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('update', () => {
    it('should update a translation', async () => {
      const id = 'some-uuid';
      const updateTranslationInput = { id: 'some-uuid', en_text: 'Hi there' };
      const expectedTranslation = { id, en_text: 'Hi there', he_text: 'שלום' };
      vi.spyOn(prisma.translation, 'update').mockResolvedValue(
        expectedTranslation,
      );

      await expect(service.update(id, updateTranslationInput)).resolves.toEqual(
        expectedTranslation,
      );
      expect(
        (prisma as unknown as { translation: { update: unknown } }).translation
          .update,
      ).toHaveBeenCalledWith({
        where: { id },
        data: updateTranslationInput,
      });
    });
  });

  describe('remove', () => {
    it('should remove a translation', async () => {
      const id = 'some-uuid';
      const expectedTranslation = { id, en_text: 'Hello', he_text: 'שלום' };
      vi.spyOn(prisma.translation, 'delete').mockResolvedValue(
        expectedTranslation,
      );

      await expect(service.remove(id)).resolves.toEqual(expectedTranslation);
      expect(
        (prisma as unknown as { translation: { delete: unknown } }).translation
          .delete,
      ).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
