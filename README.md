# reoptions

[![NPM Latest Version](https://img.shields.io/npm/v/reoptions)](https://npmjs.com/package/reoptions)
[![Bundle Size](https://img.shields.io/bundlephobia/min/reoptions?label=bundle%20size)](https://bundlephobia.com/package/reoptions)
[![Downloads Count](https://img.shields.io/npm/dm/reoptions.svg)](https://npmjs.com/package/reoptions)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/reoptions-js/publish.yml?label=ci/cd)](https://github.com/LacusSolutions/reoptions-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/reoptions-js)](https://github.com/LacusSolutions/reoptions-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/reoptions-js)](https://github.com/LacusSolutions/reoptions-js/blob/main/LICENSE)

A declarative solution for function argument validation and option management. Works seamlessly in both Node.js and browser environments with full TypeScript support.

## Features

- 🎯 **Object Literal Schema Definition** - Declarative, OpenAPI-inspired schema format
- 🔧 **Type-Safe Validation** - Full TypeScript support with type inference
- 🚀 **Cross-Platform** - Works in Node.js and browsers
- 📦 **Zero Dependencies** - Lightweight and self-contained
- 🧪 **Comprehensive Testing** - 100% line coverage with 68+ tests
- ⚡ **High Performance** - Optimized validation pipeline
- 🔄 **Integer Rounding** - Built-in rounding support for numeric values
- 🎨 **Custom Validation** - Flexible custom test functions
- 📋 **Default Values** - Automatic default value resolution

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
|--- | --- | --- | --- | --- | --- |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save reoptions

# using Bun
$ bun add reoptions
```

## Import

```javascript
// ES Modules
import reoptions from 'reoptions'

// Common JS
const reoptions = require('reoptions')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/reoptions@latest/dist/reoptions.min.js"></script>
```

## Quick Start

```javascript
import { OptionsSchema } from 'reoptions'

// Define your schema for a build tool configuration
const buildConfigSchema = OptionsSchema.create({
  target: {
    order: 1,
    type: 'string',
    required: true,
    enum: ['es5', 'es2015', 'es2017', 'es2020', 'esnext']
  },
  minify: {
    order: 2,
    type: 'boolean',
    required: false,
    default: false
  },
  sourcemap: {
    order: 3,
    type: 'boolean',
    required: false,
    default: true
  },
  concurrency: {
    order: 4,
    type: 'int',
    required: false,
    default: 4,
    round: 'floor',
    test(value) {
      if (value < 1 || value > 16) throw new Error('Concurrency must be between 1 and 16')
    }
  }
})

// Validate build configuration
const result = buildConfigSchema.validate({
  target: 'es2020',
  minify: true,
  concurrency: 8.7 // Will be rounded down to 8
})

if (result.isValid) {
  console.log('Build config:', result.sanitizedValue)
  // Output: { target: 'es2020', minify: true, sourcemap: true, concurrency: 8 }
} else {
  console.log('Config errors:', result.errors)
}

// For better performance, stop validation on first error
const quickResult = schema.validate(input, true)
```

## Schema Definition

### Field Properties

#### Required Fields
- **`required`** (optional, default: `false`): Whether the field must be present in the input
- Fields without `required` or with `required: false` are optional and will use default values if missing
- **Conflict Rule**: Required fields cannot have default values, and fields with default values are not expected to be required

#### Field Ordering
- **`order`** (optional): Controls the validation pipeline order
- Fields with defined `order` values are processed first (lower numbers = earlier processing)
- Fields without `order` are processed last (lowest priority)
- Fields with the same `order` value are processed in definition order
- This allows you to control validation dependencies and processing sequence

#### Validation Pipeline Rules
1. **Ordered fields first**: Fields with `order` defined are processed in ascending order
2. **Unordered fields last**: Fields without `order` are processed after all ordered fields
3. **Same order handling**: Fields with identical `order` values maintain their definition order
4. **Required validation**: Only fields marked as `required: true` will cause validation failure if missing
5. **Default value resolution**: Optional fields use their `default` value when missing

### Field Types

#### Integer Fields (`int`)

```javascript
{
  order: 1,
  type: 'int',
  required: true,
  default: 0,
  round: true, // or 'floor' or 'ceiling'
  test(value) {
    if (value < 0) throw new Error('Must be positive')
  }
}
```

**Rounding Options:**
- `true` - Round to nearest integer
- `'floor'` - Round down (Math.floor)
- `'ceiling'` - Round up (Math.ceil)

#### String Fields (`string`)

```javascript
{
  order: 1,
  type: 'string',
  required: true,
  default: 'default value',
  enum: ['option1', 'option2'], // Optional: restrict to specific values
  pattern: /^[a-z]+$/, // Optional: regex validation
  test(value) {
    if (value.length < 3) throw new Error('Too short')
  }
}
```

#### Float Fields (`float`)

```javascript
{
  order: 1,
  type: 'float',
  required: true,
  default: 0.0,
  test(value) {
    if (value < 0 || value > 100) throw new Error('Must be between 0 and 100')
  }
}
```

#### Boolean Fields (`boolean`)

```javascript
{
  order: 1,
  type: 'boolean',
  required: false,
  default: true
}
```

#### Object Fields (`object`)

```javascript
{
  order: 1,
  type: 'object',
  required: false,
  default: {},
  properties: {
    name: {
      type: 'string',
      order: 1,
      required: true
    },
    age: {
      type: 'int',
      order: 2,
      required: false,
      default: 0
    }
  },
  additionalProperties: false // Optional: allow extra properties
}
```

#### Array Fields (`array`)

```javascript
{
  order: 1,
  type: 'array',
  required: false,
  default: [],
  items: {
    type: 'string',
    order: 1
  },
  minItems: 1,
  maxItems: 10,
  uniqueItems: true
}
```

#### Union Fields (`union`)

```javascript
{
  order: 1,
  type: 'union',
  required: true,
  oneOf: [
    { type: 'string', order: 1 },
    { type: 'int', order: 2 }
  ]
}
```

## Use Cases

### 1. Build Tool Configuration

```javascript
const buildSchema = OptionsSchema.create({
  target: {
    order: 1,
    type: 'string',
    required: true,
    enum: ['es5', 'es2015', 'es2017', 'es2020', 'esnext']
  },
  minify: {
    order: 2,
    type: 'boolean',
    required: false,
    default: false
  },
  sourcemap: {
    order: 3,
    type: 'boolean',
    required: false,
    default: true
  },
  concurrency: {
    order: 4,
    type: 'int',
    required: false,
    default: 4,
    round: 'floor',
    test(value) {
      if (value < 1 || value > 16) throw new Error('Concurrency must be between 1 and 16')
    }
  },
  plugins: {
    order: 5,
    type: 'array',
    required: false,
    default: [],
    items: {
      type: 'string',
      order: 1
    },
    maxItems: 10
  }
})

// Usage in build tool
class BuildTool {
  constructor(config = {}) {
    const result = buildSchema.validate(config)
    if (!result.isValid) {
      throw new Error(`Invalid build config: ${result.errors.map(e => e.message).join(', ')}`)
    }

    this.config = result.sanitizedValue
  }
}
```

### 2. Database Connection Options

```javascript
const dbSchema = OptionsSchema.create({
  host: {
    order: 1,
    type: 'string',
    required: true,
    test(value) {
      if (!value.includes('.')) throw new Error('Invalid host format')
    }
  },
  port: {
    order: 2,
    type: 'int',
    required: false,
    default: 5432,
    test(value) {
      if (value < 1 || value > 65535) throw new Error('Invalid port number')
    }
  },
  ssl: {
    order: 3,
    type: 'boolean',
    required: false,
    default: false
  },
  pool: {
    order: 4,
    type: 'object',
    required: false,
    default: {},
    properties: {
      min: {
        type: 'int',
        order: 1,
        required: false,
        default: 2,
        test(value) {
          if (value < 0) throw new Error('Pool min must be non-negative')
        }
      },
      max: {
        type: 'int',
        order: 2,
        required: false,
        default: 10,
        test(value) {
          if (value < 1) throw new Error('Pool max must be positive')
        }
      },
      idleTimeout: {
        type: 'int',
        order: 3,
        required: false,
        default: 30000,
        round: true
      }
    }
  }
})

// Usage in database client
class DatabaseClient {
  constructor(options = {}) {
    const result = dbSchema.validate(options)
    if (!result.isValid) {
      throw new Error(`Invalid database config: ${result.errors.map(e => e.message).join(', ')}`)
    }

    this.options = result.sanitizedValue
  }
}
```

### 3. HTTP Client Configuration

```javascript
const httpClientSchema = OptionsSchema.create({
  baseURL: {
    order: 1,
    type: 'string',
    required: true,
    test(value) {
      try {
        new URL(value)
      } catch {
        throw new Error('Invalid base URL format')
      }
    }
  },
  timeout: {
    order: 2,
    type: 'int',
    required: false,
    default: 5000,
    round: true,
    test(value) {
      if (value < 1000) throw new Error('Timeout must be at least 1000ms')
    }
  },
  retries: {
    order: 3,
    type: 'int',
    required: false,
    default: 3,
    test(value) {
      if (value < 0 || value > 10) throw new Error('Retries must be between 0 and 10')
    }
  },
  headers: {
    order: 4,
    type: 'object',
    required: false,
    default: {},
    additionalProperties: true
  },
  interceptors: {
    order: 5,
    type: 'array',
    required: false,
    default: [],
    items: {
      type: 'string',
      order: 1,
      enum: ['request', 'response', 'error']
    },
    uniqueItems: true
  }
})

// Usage in HTTP client
class HttpClient {
  constructor(config = {}) {
    const result = httpClientSchema.validate(config)
    if (!result.isValid) {
      throw new Error(`Invalid HTTP client config: ${result.errors.map(e => e.message).join(', ')}`)
    }

    this.config = result.sanitizedValue
  }
}
```

### 4. Logger Configuration

```javascript
const loggerSchema = OptionsSchema.create({
  level: {
    order: 1,
    type: 'string',
    required: true,
    enum: ['debug', 'info', 'warn', 'error', 'fatal']
  },
  format: {
    order: 2,
    type: 'string',
    required: false,
    default: 'json',
    enum: ['json', 'text', 'pretty']
  },
  transports: {
    order: 3,
    type: 'array',
    required: false,
    default: ['console'],
    items: {
      type: 'string',
      order: 1,
      enum: ['console', 'file', 'http', 'stream']
    },
    uniqueItems: true
  },
  file: {
    order: 4,
    type: 'object',
    required: false,
    default: {},
    properties: {
      filename: {
        type: 'string',
        order: 1,
        required: false,
        default: 'app.log'
      },
      maxSize: {
        type: 'int',
        order: 2,
        required: false,
        default: 10485760, // 10MB
        round: true
      },
      maxFiles: {
        type: 'int',
        order: 3,
        required: false,
        default: 5,
        test(value) {
          if (value < 1 || value > 100) throw new Error('Max files must be between 1 and 100')
        }
      }
    }
  }
})

// Usage in logger
class Logger {
  constructor(config = {}) {
    const result = loggerSchema.validate(config)
    if (!result.isValid) {
      throw new Error(`Invalid logger config: ${result.errors.map(e => e.message).join(', ')}`)
    }

    this.config = result.sanitizedValue
  }
}
```

### 5. Test Runner Configuration

```javascript
const testRunnerSchema = OptionsSchema.create({
  framework: {
    order: 1,
    type: 'string',
    required: true,
    enum: ['jest', 'mocha', 'vitest', 'bun', 'node']
  },
  watch: {
    order: 2,
    type: 'boolean',
    required: false,
    default: false
  },
  coverage: {
    order: 3,
    type: 'object',
    required: false,
    default: {},
    properties: {
      enabled: {
        type: 'boolean',
        order: 1,
        required: false,
        default: false
      },
      threshold: {
        type: 'int',
        order: 2,
        required: false,
        default: 80,
        test(value) {
          if (value < 0 || value > 100) throw new Error('Coverage threshold must be between 0 and 100')
        }
      },
      reporters: {
        type: 'array',
        order: 3,
        required: false,
        default: ['text'],
        items: {
          type: 'string',
          order: 1,
          enum: ['text', 'html', 'json', 'lcov', 'cobertura']
        },
        uniqueItems: true
      }
    }
  },
  parallel: {
    order: 4,
    type: 'boolean',
    required: false,
    default: true
  },
  timeout: {
    order: 5,
    type: 'int',
    required: false,
    default: 5000,
    round: true,
    test(value) {
      if (value < 1000) throw new Error('Timeout must be at least 1000ms')
    }
  }
})

// Usage in test runner
class TestRunner {
  constructor(config = {}) {
    const result = testRunnerSchema.validate(config)
    if (!result.isValid) {
      throw new Error(`Invalid test config: ${result.errors.map(e => e.message).join(', ')}`)
    }

    this.config = result.sanitizedValue
  }
}
```

## API Reference

### OptionsSchema

#### `OptionsSchema.create(definition)`

Creates a new schema from a definition object.

**Parameters:**
- `definition` (SchemaDefinition): Object defining the schema structure

**Returns:** `OptionsSchema` instance

#### `schema.validate(input, bail?)`

Validates input against the schema.

**Parameters:**
- `input` (Record<string, unknown>): Input data to validate
- `bail` (boolean, optional): If `true`, stops validation on first error for better performance. Default: `false`

**Returns:** `ValidationResult` object

**Performance Note:** When `bail=true`, validation stops as soon as the first error is found, which can significantly improve performance for large schemas when you only need to know if there are any errors.

#### `schema.getDefaults()`

Returns default values for all optional fields.

**Returns:** `Record<string, unknown>` object with default values

#### `schema.getFieldNames()`

Returns array of field names in order.

**Returns:** `string[]` array of field names

#### `schema.getFieldDefinition(name)`

Returns field definition by name.

**Parameters:**
- `name` (string): Field name

**Returns:** `FieldDefinition | undefined`

### ValidationResult

#### Properties

- `isValid` (boolean): Whether validation passed
- `errors` (ValidationError[]): Array of validation errors
- `sanitizedValue` (unknown): Processed and validated value

#### Static Methods

- `ValidationResult.success(value)`: Create successful result
- `ValidationResult.failure(errors)`: Create failed result
- `ValidationResult.error(message, field?, value?)`: Create single error result

### Error Classes

#### ValidationError

Base validation error class.

```javascript
new ValidationError(message, field?, value?)
ValidationError.forField(field, message, value?)
ValidationError.typeMismatch(field, expected, actual)
```

#### FieldError

Field-specific error for detailed reporting.

```javascript
new FieldError(field, message, value?, code?)
FieldError.required(field)
FieldError.typeMismatch(field, expected, actual)
```

#### CustomTestError

Error thrown by custom test functions.

```javascript
new CustomTestError(message, field?, value?)
```

## TypeScript Support

Full TypeScript support with type inference and strict type checking.

```typescript
import { OptionsSchema, type SchemaDefinition } from 'reoptions'

interface BuildConfig {
  target: string
  minify: boolean
  concurrency: number
}

const schema: SchemaDefinition = {
  target: {
    order: 1,
    type: 'string',
    required: true,
    enum: ['es5', 'es2015', 'es2017', 'es2020', 'esnext']
  },
  minify: {
    order: 2,
    type: 'boolean',
    required: false,
    default: false
  },
  concurrency: {
    order: 3,
    type: 'int',
    required: false,
    default: 4,
    round: 'floor'
  }
}

const buildSchema = OptionsSchema.create(schema)
const result = buildSchema.validate({
  target: 'es2020',
  minify: true,
  concurrency: 8.7
})
// result.sanitizedValue is properly typed as BuildConfig
```

## Performance

- **Lightweight**: Zero dependencies, minimal bundle size
- **Fast**: Optimized validation pipeline
- **Memory Efficient**: No unnecessary object creation
- **Tree Shakeable**: Modular design for optimal bundling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## Support

If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/reoptions-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/reoptions-js/issues)
