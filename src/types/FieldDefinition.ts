import { type FieldType, type FieldTypeValue } from './FieldType';

export interface BaseFieldDefinition<T extends FieldTypeValue> {
  default?: FieldType<T>;
  description?: string;
  order?: number;
  required?: boolean;
  test?: (value: FieldType<T>) => never | void;
  type: T;
}

export interface StringFieldDefinition extends BaseFieldDefinition<'string'> {
  enum?: string[];
  pattern?: RegExp | string;
}

export interface IntFieldDefinition extends BaseFieldDefinition<'int'> {
  round?: 'ceiling' | 'floor' | boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FloatFieldDefinition extends BaseFieldDefinition<'float'> {}

export interface BooleanFieldDefinition extends BaseFieldDefinition<'boolean'> {
  type: 'boolean';
}

export interface ObjectFieldDefinition extends BaseFieldDefinition<'object'> {
  additionalProperties?: boolean;
  properties: Record<string, FieldDefinition>;
}

export interface ArrayFieldDefinition extends BaseFieldDefinition<'array'> {
  items: FieldDefinition;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
}

export interface UnionFieldDefinition extends BaseFieldDefinition<'union'> {
  oneOf: FieldDefinition[];
}

export type FieldDefinition =
  | ArrayFieldDefinition
  | BooleanFieldDefinition
  | FloatFieldDefinition
  | IntFieldDefinition
  | ObjectFieldDefinition
  | StringFieldDefinition
  | UnionFieldDefinition;

export type SchemaDefinition = Record<string, FieldDefinition>;
