import { faker } from '@faker-js/faker';
import type { OpenAPIV3 } from 'openapi-types';

export function exampleObjectFromSchema(object: OpenAPIV3.SchemaObject, objectName?: string): string {
  console.log('getting values for properties of: ', objectName);
  const propertyNames = Object.keys(object.properties);
  const keyValPairs: string = propertyNames.reduce((props, key, i) => {
    const commaIfNotLastItem = i === propertyNames.length - 1 ? '' : ',';
    const value = getExampleValue(object.properties[key], key);
    return `${props}${key}:${value}${commaIfNotLastItem}`;
  }, '');

  return `{ ${keyValPairs} }`;
}

export function getExampleValue(schema: OpenAPIV3.SchemaObject, schemaName?: string): any {
  if (schemaName) {
    console.log(`Property ${schemaName} is of type ${schema.type
      } `);
  }

  if (schema.anyOf) {
    return exampleObjectFromSchema(schema.anyOf[0], schemaName);
  }
  if (schema.oneOf) {
    return exampleObjectFromSchema(schema.oneOf[0], schemaName);
  }
  if (schema.allOf) {
    return exampleObjectFromSchema(mergeSchemas(schema.allOf));
  }
  if (schema.type === 'array') {
    if (schema.example) {
      if (schema.items.type === "string") {
        return "[" + schema.example.reduce((acc: string, item: string) => acc + `"${item}", `, '') + "]";
      }
      return "[" + schema.example + "]";
    }
    const max = schema.maxItems || 5;
    const min = schema.minItems || 1;
    const randomInt = faker.number.int({ min, max });
    const arr = [];
    for (let i = 0; i < randomInt; i++) {
      arr.push(getExampleValue(schema.items as OpenAPIV3.SchemaObject, schemaName));
    }
    return "[" + arr + "]";
  }
  if (schema.type === 'object') {
    return exampleObjectFromSchema(schema, schemaName);
  }
  if (schema.type === 'string') {
    if (schema.enum) {
      return `"${schema.enum[0]}"`;
    }
  }
  if (schema.enum) {
    return schema.enum[0];
  }
  if (schema.example) {
    // string example values must be explicitly wrapped in quotes when added to the file template
    if (typeof schema.example === 'string') {
      return `"${schema.example}"`;
    }
    return schema.example;
  }

  return getRandomStringNumberOrBool(schema.type || 'string', schemaName);
}

export function getRandomStringNumberOrBool(type: string, propertyName?: string): string | number | boolean | null {
  if (propertyName) {
    if (propertyName.match(/total|amount|value|max|min/i) && ['number', 'integer'].includes(type)) {
      return faker.number.int({ min: 0, max: 10000 });
    }
    if (propertyName.match(/timestamp|ts/i) && ['number', 'integer'].includes(type)) {
      return (faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }) as Date).getMilliseconds();
    }
    if (propertyName.match(/date/i) && type === 'string') {
      const date = faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }).toISOString();
      console.log("DATE: ", date);

      return `"${date}"`;
    }
    if (propertyName.match(/country/i) && type === 'string') {
      return `"${faker.location.countryCode('alpha-3')}"`;
    }
  }
  if (type === 'boolean') {
    return true;
  }
  if (type === 'string') {
    console.log('returning random noun for property', propertyName);
    return `"${faker.word.noun()}"`;
  }
  if (['number', 'integer'].includes(type)) {
    return faker.number.int();
  }
  return null;
}

function mergeSchemas(schemas: OpenAPIV3.SchemaObject[]): OpenAPIV3.BaseSchemaObject {
  return {
    properties: Object.assign(...(schemas.map(s => s.properties)))
  };
}