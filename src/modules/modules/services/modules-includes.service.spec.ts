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
      expect(result.subModules).toHaveProperty('include.name', true);
      expect(result.subModules).toHaveProperty('include.Block');
    });

    it('should include prerequisiteFor and postrequisiteOf in Block relationships', () => {
      const result = service.getBaseInclude();

      expect(result.subModules).toHaveProperty('include.Block.include');
      expect(result.subModules).toHaveProperty('include.Block.include.prerequisiteFor');
      expect(result.subModules).toHaveProperty('include.Block.include.postrequisiteOf');
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
      expect(result.Block).toHaveProperty('include');
      expect(result.Block).toHaveProperty('include.prerequisiteFor');
      expect(result.Block).toHaveProperty('include.postrequisiteOf');
    });

    it('should include nested Block relationships in prerequisiteFor', () => {
      const result = service.getDetailedInclude();

      expect(result.Block).toHaveProperty('include.prerequisiteFor.include');
      expect(result.Block).toHaveProperty('include.prerequisiteFor.include.postrequisite');
      expect(result.Block).toHaveProperty('include.prerequisiteFor.include.metadata', true);
    });

    it('should include nested Block relationships in postrequisiteOf', () => {
      const result = service.getDetailedInclude();

      expect(result.Block).toHaveProperty('include.postrequisiteOf.include');
      expect(result.Block).toHaveProperty('include.postrequisiteOf.include.prerequisite');
      expect(result.Block).toHaveProperty('include.postrequisiteOf.include.metadata', true);
    });

    it('should include Module names in prerequisite and postrequisite relationships', () => {
      const result = service.getDetailedInclude();

      expect(result.Block).toHaveProperty('include.prerequisiteFor.include.postrequisite.include');
      expect(result.Block).toHaveProperty('include.prerequisiteFor.include.postrequisite.include.Module');
      expect(result.Block).toHaveProperty('include.prerequisiteFor.include.postrequisite.include.Module.include');
      expect(result.Block).toHaveProperty('include.prerequisiteFor.include.postrequisite.include.Module.include.name', true);

      expect(result.Block).toHaveProperty('include.postrequisiteOf.include.prerequisite.include');
      expect(result.Block).toHaveProperty('include.postrequisiteOf.include.prerequisite.include.Module');
      expect(result.Block).toHaveProperty('include.postrequisiteOf.include.prerequisite.include.Module.include');
      expect(result.Block).toHaveProperty('include.postrequisiteOf.include.prerequisite.include.Module.include.name', true);
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

      expect(baseInclude.subModules).toHaveProperty('include.Block');
      expect(detailedInclude.Block).toBeDefined();
    });
  });
});
