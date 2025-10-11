import { describe, it, expect, beforeEach } from 'vitest';
import { ModulesIncludesService } from './modules-includes.service';

describe('ModulesIncludesService', () => {
  let service: ModulesIncludesService;

  beforeEach(() => {
    service = new ModulesIncludesService();
  });

  describe('getBaseInclude', () => {
    it('should return include object with name, Course, subModules, and parentModules', () => {
      const result = service.getBaseInclude();

      expect(result).toBeDefined();
      expect(result.name).toBe(true);
      expect(result.Course).toBeDefined();
      expect(result.subModules).toBeDefined();
      expect(result.parentModules).toBeDefined();
    });

    it('should include Block relationships in subModules', () => {
      const result = service.getBaseInclude();

      expect(result.subModules).toBeDefined();
      expect(result.subModules).toHaveProperty('include');

      const subModulesInclude = result.subModules as { include: { name: boolean; Block: object } };
      expect(subModulesInclude.include.name).toBe(true);
      expect(subModulesInclude.include.Block).toBeDefined();
    });

    it('should include prerequisiteFor and postrequisiteOf in Block relationships', () => {
      const result = service.getBaseInclude();

      const subModulesInclude = result.subModules as {
        include: {
          Block: {
            include: {
              prerequisiteFor: object;
              postrequisiteOf: object;
            }
          }
        }
      };

      expect(subModulesInclude.include.Block).toHaveProperty('include');
      expect(subModulesInclude.include.Block.include).toHaveProperty('prerequisiteFor');
      expect(subModulesInclude.include.Block.include).toHaveProperty('postrequisiteOf');
    });
  });

  describe('getDetailedInclude', () => {
    it('should return include object with name, Block, Questions, Course, subModules, and parentModules', () => {
      const result = service.getDetailedInclude();

      expect(result).toBeDefined();
      expect(result.name).toBe(true);
      expect(result.Block).toBeDefined();
      expect(result.Questions).toBeDefined();
      expect(result.Course).toBeDefined();
      expect(result.subModules).toBeDefined();
      expect(result.parentModules).toBeDefined();
    });

    it('should include Block with prerequisite relationships', () => {
      const result = service.getDetailedInclude();

      expect(result.Block).toBeDefined();
      const blockInclude = result.Block as { include: { prerequisiteFor: object; postrequisiteOf: object } };

      expect(blockInclude).toHaveProperty('include');
      expect(blockInclude.include).toHaveProperty('prerequisiteFor');
      expect(blockInclude.include).toHaveProperty('postrequisiteOf');
    });

    it('should include nested Block relationships in prerequisiteFor', () => {
      const result = service.getDetailedInclude();

      const blockInclude = result.Block as {
        include: {
          prerequisiteFor: {
            include: {
              postrequisite: object;
              metadata: boolean;
            }
          }
        }
      };

      expect(blockInclude.include.prerequisiteFor).toHaveProperty('include');
      expect(blockInclude.include.prerequisiteFor.include).toHaveProperty('postrequisite');
      expect(blockInclude.include.prerequisiteFor.include).toHaveProperty('metadata');
    });

    it('should include nested Block relationships in postrequisiteOf', () => {
      const result = service.getDetailedInclude();

      const blockInclude = result.Block as {
        include: {
          postrequisiteOf: {
            include: {
              prerequisite: object;
              metadata: boolean;
            }
          }
        }
      };

      expect(blockInclude.include.postrequisiteOf).toHaveProperty('include');
      expect(blockInclude.include.postrequisiteOf.include).toHaveProperty('prerequisite');
      expect(blockInclude.include.postrequisiteOf.include).toHaveProperty('metadata');
    });

    it('should include Module names in prerequisite and postrequisite relationships', () => {
      const result = service.getDetailedInclude();

      const blockInclude = result.Block as {
        include: {
          prerequisiteFor: {
            include: {
              postrequisite: {
                include: {
                  Module: { include: { name: boolean } }
                }
              }
            }
          };
          postrequisiteOf: {
            include: {
              prerequisite: {
                include: {
                  Module: { include: { name: boolean } }
                }
              }
            }
          }
        }
      };

      // Check prerequisiteFor -> postrequisite -> Module -> name
      expect(blockInclude.include.prerequisiteFor.include.postrequisite).toHaveProperty('include');
      const prereqPostreqInclude = blockInclude.include.prerequisiteFor.include.postrequisite.include;
      expect(prereqPostreqInclude.Module).toHaveProperty('include');
      expect(prereqPostreqInclude.Module.include.name).toBe(true);

      // Check postrequisiteOf -> prerequisite -> Module -> name
      expect(blockInclude.include.postrequisiteOf.include.prerequisite).toHaveProperty('include');
      const postreqPrereqInclude = blockInclude.include.postrequisiteOf.include.prerequisite.include;
      expect(postreqPrereqInclude.Module).toHaveProperty('include');
      expect(postreqPrereqInclude.Module.include.name).toBe(true);
    });
  });

  describe('getCourseModulesInclude', () => {
    it('should return include object with name and Course only', () => {
      const result = service.getCourseModulesInclude();

      expect(result).toBeDefined();
      expect(result.name).toBe(true);
      expect(result.Course).toBeDefined();
    });

    it('should not include Block relationships for course modules', () => {
      const result = service.getCourseModulesInclude();

      expect(result).not.toHaveProperty('Block');
      expect(result).not.toHaveProperty('subModules');
      expect(result).not.toHaveProperty('parentModules');
    });
  });

  describe('Block relationships structure', () => {
    it('should ensure subModules have same Block structure as parent module', () => {
      const baseInclude = service.getBaseInclude();
      const detailedInclude = service.getDetailedInclude();

      const baseSubModulesInclude = baseInclude.subModules as {
        include: { Block: object }
      };
      const detailedBlockInclude = detailedInclude.Block;

      // Both should have Block with prerequisiteFor and postrequisiteOf
      expect(baseSubModulesInclude.include.Block).toBeDefined();
      expect(detailedBlockInclude).toBeDefined();
    });
  });
});
