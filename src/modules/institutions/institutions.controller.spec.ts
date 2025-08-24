import 'reflect-metadata';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { InstitutionsController } from './institutions.controller';
import { InstitutionsService } from './institutions.service';
describe('InstitutionsController (REST)', () => {
  let controller: InstitutionsController;
  let service: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    service = {
      create: vi.fn(),
      findAll: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };
    controller = new InstitutionsController(
      service as unknown as InstitutionsService,
    );
  });

  it('create() should call service and return created university', async () => {
    const body = {
      en_text: 'Tel Aviv University',
      he_text: 'אוניברסיטת תל אביב',
    };
    const created = {
      id: 'u1',
      translationId: 't1',
      name: { en_text: body.en_text, he_text: body.he_text },
    };
    service.create.mockResolvedValue(created);

    const res = await controller.create(body);
    expect(res).toEqual(created);
    expect(service.create).toHaveBeenCalledWith(body);
  });

  it('findAll() should return list', async () => {
    const uniList = [
      { id: 'u1', name: { en_text: 'One', he_text: 'אחד' }, courses: [] },
      { id: 'u2', name: { en_text: 'Two', he_text: 'שתיים' }, courses: [] },
    ];
    service.findAll.mockResolvedValue(uniList);

    const res = await controller.findAll();
    expect(res).toEqual(uniList);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne() should return specific university', async () => {
    const uni = { id: 'u1', name: { en_text: 'One', he_text: 'אחד' } };
    service.findUnique.mockResolvedValue(uni);
    const res = await controller.findOne('u1');
    expect(res).toEqual(uni);
    expect(service.findUnique).toHaveBeenCalledWith('u1');
  });

  it('findOne() returns null when not found', async () => {
    service.findUnique.mockResolvedValue(null);
    const res = await controller.findOne('missing');
    expect(res).toBeNull();
    expect(service.findUnique).toHaveBeenCalledWith('missing');
  });

  it('update() should call service with id merged into dto', async () => {
    const id = 'u1';
    const dto = { en_text: 'Updated EN', he_text: 'עודכן' };
    const updated = { id, ...dto };
    service.update.mockResolvedValue(updated);

    const res = await controller.update(id, dto);
    expect(res).toEqual(updated);
    expect(service.update).toHaveBeenCalledWith(id, { ...dto, id });
  });

  it('remove() should call service and return void', async () => {
    const id = 'u1';
    service.remove.mockResolvedValue({ id });
    const res = await controller.remove(id);
    expect(res).toEqual({ id });
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
