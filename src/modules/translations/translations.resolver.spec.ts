import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslationsResolver } from './translations.resolver';
import { TranslationsService } from './translations.service';
import { CreateTranslationInput } from './dto/create-translation.input';
import { UpdateTranslationInput } from './dto/update-translation.input';

describe('TranslationsResolver', () => {
  let resolver: TranslationsResolver;
  let service: Pick<
    TranslationsService,
    'create' | 'findAll' | 'findOne' | 'update' | 'remove'
  >;

  beforeEach(() => {
    service = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    } as unknown as TranslationsService;

    resolver = new TranslationsResolver(
      service as unknown as TranslationsService,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTranslation', () => {
    it('should create a translation', async () => {
      const createTranslationInput: CreateTranslationInput = {
        en_text: 'Hello',
        he_text: 'שלום',
      };
      const expectedTranslation = {
        id: 'some-uuid',
        ...createTranslationInput,
      };
      vi.spyOn(service, 'create').mockResolvedValue(expectedTranslation as any);

      await expect(
        resolver.createTranslation(createTranslationInput),
      ).resolves.toEqual(expectedTranslation);
      expect(service.create).toHaveBeenCalledWith(createTranslationInput);
    });
  });

  describe('findAll', () => {
    it('should return an array of translations', async () => {
      const expectedTranslations = [
        { id: 'uuid1', en_text: 'Hello', he_text: 'שלום' },
        { id: 'uuid2', en_text: 'World', he_text: 'עולם' },
      ];
      vi.spyOn(service, 'findAll').mockResolvedValue(
        expectedTranslations as any,
      );

      await expect(resolver.findAll()).resolves.toEqual(expectedTranslations);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single translation', async () => {
      const id = 'some-uuid';
      const expectedTranslation = { id, en_text: 'Hello', he_text: 'שלום' };
      vi.spyOn(service, 'findOne').mockResolvedValue(
        expectedTranslation as any,
      );

      await expect(resolver.findOne(id)).resolves.toEqual(expectedTranslation);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should return null if translation not found', async () => {
      const id = 'non-existent-uuid';
      vi.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(resolver.findOne(id)).resolves.toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('updateTranslation', () => {
    it('should update a translation', async () => {
      const updateTranslationInput: UpdateTranslationInput = {
        id: 'some-uuid',
        en_text: 'Hi there',
      };
      const expectedTranslation = {
        id: 'some-uuid',
        en_text: 'Hi there',
        he_text: 'שלום',
      };
      vi.spyOn(service, 'update').mockResolvedValue(expectedTranslation as any);

      await expect(
        resolver.updateTranslation(updateTranslationInput),
      ).resolves.toEqual(expectedTranslation);
      expect(service.update).toHaveBeenCalledWith(
        updateTranslationInput.id,
        updateTranslationInput,
      );
    });
  });

  describe('removeTranslation', () => {
    it('should remove a translation', async () => {
      const id = 'some-uuid';
      const expectedTranslation = { id, en_text: 'Hello', he_text: 'שלום' };
      vi.spyOn(service, 'remove').mockResolvedValue(expectedTranslation as any);

      await expect(resolver.removeTranslation(id)).resolves.toEqual(
        expectedTranslation,
      );
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
