import { describe, expect, it } from 'bun:test';

import { CustomTestError } from '../../src/errors/CustomTestError';

describe('CustomTestError', () => {
  describe('constructor', () => {
    it('should create error with message only', () => {
      const error = new CustomTestError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.name).toBe('CustomTestError');
      expect(error.field).toBeUndefined();
      expect(error.value).toBeUndefined();
    });

    it('should create error with field and value', () => {
      const error = new CustomTestError('Test error', 'field1', 'test value');

      expect(error.message).toBe('Test error');
      expect(error.field).toBe('field1');
      expect(error.value).toBe('test value');
    });

    it('should be instance of Error', () => {
      const error = new CustomTestError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CustomTestError);
    });
  });

  describe('error properties', () => {
    it('should have correct name', () => {
      const error = new CustomTestError('Test error');
      expect(error.name).toBe('CustomTestError');
    });

    it('should preserve message', () => {
      const message = 'Custom validation failed';
      const error = new CustomTestError(message);
      expect(error.message).toBe(message);
    });

    it('should preserve field information', () => {
      const field = 'username';
      const error = new CustomTestError('Invalid username', field);
      expect(error.field).toBe(field);
    });

    it('should preserve value information', () => {
      const value = { invalid: true };
      const error = new CustomTestError('Invalid value', 'field1', value);
      expect(error.value).toBe(value);
    });
  });
});
