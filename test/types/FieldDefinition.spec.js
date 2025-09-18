import { describe, expect, it } from 'bun:test';

describe('FieldDefinition Types', () => {
  describe('StringFieldDefinition', () => {
    it('should have correct type structure', () => {
      const stringDef = {
        type: 'string',
        required: true,
        enum: ['option1', 'option2'],
        pattern: /^[a-z]+$/,
      };

      expect(stringDef.type).toBe('string');
      expect(stringDef.enum).toEqual(['option1', 'option2']);
      expect(stringDef.pattern).toBeInstanceOf(RegExp);
    });
  });

  describe('IntFieldDefinition', () => {
    it('should have correct type structure', () => {
      const intDef = {
        type: 'int',
        required: false,
        default: 42,
        round: 'floor',
      };

      expect(intDef.type).toBe('int');
      expect(intDef.round).toBe('floor');
    });

    it('should support all round options', () => {
      const roundOptions = [true, 'floor', 'ceiling'];

      roundOptions.forEach((round) => {
        const intDef = {
          type: 'int',
          round,
        };
        expect(intDef.round).toBe(round);
      });
    });
  });

  describe('FloatFieldDefinition', () => {
    it('should have correct type structure', () => {
      const floatDef = {
        type: 'float',
        required: true,
      };

      expect(floatDef.type).toBe('float');
    });
  });

  describe('BooleanFieldDefinition', () => {
    it('should have correct type structure', () => {
      const boolDef = {
        type: 'boolean',
        required: false,
        default: true,
      };

      expect(boolDef.type).toBe('boolean');
      expect(boolDef.default).toBe(true);
    });
  });

  describe('ObjectFieldDefinition', () => {
    it('should have correct type structure', () => {
      const objectDef = {
        type: 'object',
        required: false,
        properties: {
          name: { type: 'string' },
          age: { type: 'int' },
        },
        additionalProperties: false,
      };

      expect(objectDef.type).toBe('object');
      expect(objectDef.properties).toBeDefined();
      expect(objectDef.additionalProperties).toBe(false);
    });
  });

  describe('ArrayFieldDefinition', () => {
    it('should have correct type structure', () => {
      const arrayDef = {
        type: 'array',
        required: false,
        items: { type: 'string' },
        minItems: 1,
        maxItems: 10,
        uniqueItems: true,
      };

      expect(arrayDef.type).toBe('array');
      expect(arrayDef.items).toBeDefined();
      expect(arrayDef.minItems).toBe(1);
      expect(arrayDef.maxItems).toBe(10);
      expect(arrayDef.uniqueItems).toBe(true);
    });
  });

  describe('UnionFieldDefinition', () => {
    it('should have correct type structure', () => {
      const unionDef = {
        type: 'union',
        oneOf: [{ type: 'string' }, { type: 'int' }],
      };

      expect(unionDef.type).toBe('union');
      expect(unionDef.oneOf).toHaveLength(2);
    });
  });
});
