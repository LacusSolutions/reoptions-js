export type FieldTypeValue = 'array' | 'boolean' | 'float' | 'int' | 'object' | 'string' | 'union';

export type FieldType<T extends FieldTypeValue> = T extends 'array'
  ? unknown[]
  : T extends 'boolean'
    ? boolean
    : T extends 'float' | 'int'
      ? number
      : T extends 'string'
        ? string
        : T extends 'object'
          ? Record<string, unknown>
          : T extends 'union'
            ? unknown
            : never;
