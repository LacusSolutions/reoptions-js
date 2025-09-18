import { describe, expect, it } from 'bun:test';

import { FieldError } from '../../src/errors/FieldError';

describe('FieldError', () => {
  describe('constructor', () => {
    it('should create error with field and message', () => {
      const error = new FieldError('field1', 'Test error');

      expect(error.message).toBe('Test error');
      expect(error.name).toBe('FieldError');
      expect(error.field).toBe('field1');
      expect(error.value).toBeUndefined();
      expect(error.code).toBeUndefined();
    });

    it('should create error with all parameters', () => {
      const error = new FieldError('field1', 'Test error', 'test value', 'CUSTOM_CODE');

      expect(error.message).toBe('Test error');
      expect(error.field).toBe('field1');
      expect(error.value).toBe('test value');
      expect(error.code).toBe('CUSTOM_CODE');
    });

    it('should be instance of Error', () => {
      const error = new FieldError('field1', 'Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(FieldError);
    });
  });

  describe('static methods', () => {
    it('should create required field error', () => {
      const error = FieldError.required('field1');

      expect(error.message).toBe('Field "field1" is required');
      expect(error.field).toBe('field1');
      expect(error.code).toBe('REQUIRED');
      expect(error.value).toBeUndefined();
    });

    it('should create type mismatch error', () => {
      const error = FieldError.typeMismatch('field1', 'string', 123);

      expect(error.message).toBe('Field "field1": Expected string, got number');
      expect(error.field).toBe('field1');
      expect(error.value).toBe(123);
      expect(error.code).toBe('TYPE_MISMATCH');
    });

    it('should handle different types in type mismatch', () => {
      const error = FieldError.typeMismatch('field1', 'number', 'not a number');

      expect(error.message).toBe('Field "field1": Expected number, got string');
      expect(error.field).toBe('field1');
      expect(error.value).toBe('not a number');
      expect(error.code).toBe('TYPE_MISMATCH');
    });
  });

  describe('error properties', () => {
    it('should have correct name', () => {
      const error = new FieldError('field1', 'Test error');
      expect(error.name).toBe('FieldError');
    });

    it('should preserve all constructor parameters', () => {
      const field = 'testField';
      const message = 'Custom error message';
      const value = { data: 'test' };
      const code = 'CUSTOM_ERROR';

      const error = new FieldError(field, message, value, code);

      expect(error.field).toBe(field);
      expect(error.message).toBe(message);
      expect(error.value).toBe(value);
      expect(error.code).toBe(code);
    });
  });
});
