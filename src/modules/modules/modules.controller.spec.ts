import { describe, it, expect, vi } from 'vitest';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

describe('ModulesController', () => {
  it('gets a module from service', async () => {
    const service = {
      findUnique: vi.fn().mockResolvedValue({
        id: 'm1',
        name: { en_text: 'mod', he_text: 'מודול' },
        subModules: [],
        parentModules: [],
        prerequisites: [],
        postrequisites: [],
      }),
    } as unknown as ModulesService;

    const controller = new ModulesController(service);
    const result = await controller.getModule('m1');

    expect(result).toEqual({
      id: 'm1',
      name: { en_text: 'mod', he_text: 'מודול' },
      subModules: [],
      parentModules: [],
      prerequisites: [],
      postrequisites: [],
    });
  });
});
