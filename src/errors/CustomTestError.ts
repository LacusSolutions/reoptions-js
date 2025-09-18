/**
 * Error thrown by custom test functions
 */
export class CustomTestError extends Error {
  public readonly field?: string;
  public readonly value?: unknown;

  public constructor(message: string, field?: string, value?: unknown) {
    super(message);
    this.name = 'CustomTestError';
    this.field = field;
    this.value = value;
  }
}
