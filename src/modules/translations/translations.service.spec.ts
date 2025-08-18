import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsService } from './translations.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TranslationsService', () => {
  let service: TranslationsService;
  let prisma: PrismaService; // This will hold the mocked PrismaService

  beforeEach(async () => {
    // Create a mock for PrismaService
    const prismaMock = {
      translation: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationsService,
        {
          provide: PrismaService,
          useValue: prismaMock, // Provide the mock here
        },
      ],
    }).compile();

    service = module.get<TranslationsService>(TranslationsService);
    prisma = module.get<PrismaService>(PrismaService); // Get the mocked PrismaService
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
      const updateTranslationInput = { en_text: 'Hi there' };
      const expectedTranslation = { id, en_text: 'Hi there', he_text: 'שלום' };
      vi.spyOn(prisma.translation, 'update').mockResolvedValue(
        expectedTranslation,
      );

      await expect(service.update(id, updateTranslationInput)).resolves.toEqual(
        expectedTranslation,
      );
      expect(prisma.translation.update).toHaveBeenCalledWith({
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
      expect(prisma.translation.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
