import { expect, test, describe } from 'bun:test';
import { buildFactoryFile } from '../src/buildFiles/buildFactory';
import { getRandomStringNumberOrBool, getValueForProperty, getObjectProperties } from '../src/getExampleValue';
import prettier from 'prettier';
import type { OpenAPIV3 } from 'openapi-types';

const exampleFactory = "import { Factory } from 'miragejs';\n\nexport default Factory.extend({\n  valid: true,\n  modifiedDate: '2025-08-15T01:36:34.749Z',\n  nameOnCard: 'Thomas Middlehurst',\n  totalAmountDeposited: 1000,\n  scheme: 'VISA',\n  transactions: ['Buy Groceries', 'Buy Coffee']\n});\n";

describe('Getting field values', () => {

  test('gets example primitive value for a field', () => {
    expect(typeof getRandomStringNumberOrBool('number', 'total')).toBe('number');
    expect(typeof getRandomStringNumberOrBool('number', 'timestamp')).toBe('number');
    expect(typeof getRandomStringNumberOrBool('string', 'date')).toBe('string');
    expect(typeof getRandomStringNumberOrBool('string', 'country')).toBe('string');
    expect(typeof getRandomStringNumberOrBool('string', 'foo')).toBe('string');
    expect(typeof getRandomStringNumberOrBool('string', 'name')).toBe('string');
    expect(typeof getRandomStringNumberOrBool('number', 'bar')).toBe('number');
    expect(typeof getRandomStringNumberOrBool('boolean', 'baz')).toBe('boolean');
    expect(getRandomStringNumberOrBool('string', 'startDate')).toMatch(/^\"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\"$/);
  });

  test('gets value for string enum property', () => {
    const propertyName = 'PutOrCall';
    const property: OpenAPIV3.SchemaObject = {
      "type": "string",
      "enum": [
        "Put",
        "Call",
        "Chooser",
        "Other",
        "DEFAULT"
      ]
    };

    expect(getValueForProperty(property, propertyName)).toBe('\"Put\"');
  });

  test('gets value for string property with example', () => {
    const propertyName = 'SecurityID';
    const property: OpenAPIV3.SchemaObject = {
      "type": "string",
      "example": "202405220923260000235870D"
    };

    expect(getValueForProperty(property, propertyName)).toBe('\"202405220923260000235870D\"');
  });

  test('gets value for number property with example', () => {
    const propertyName = 'maturityDate';
    const property: OpenAPIV3.SchemaObject = {
      "type": "number",
      "example": 20240524
    };
    expect(getValueForProperty(property, propertyName)).toBe(20240524);
  });

  test('gets value for integer property with example', () => {
    const propertyName = 'maturityDate';
    const property: OpenAPIV3.SchemaObject = {
      "type": "integer",
      "example": 20240524
    };

    expect(getValueForProperty(property, propertyName)).toBe(20240524);
  });

  test('gets value for array property of type string with example', () => {
    const propertyName = 'transactions';
    const property: OpenAPIV3.SchemaObject = {
      "type": "array",
      "items": {
        "type": "string"
      },
      "example": [
        "Buy Groceries",
        "Buy Coffee"
      ]
    };

    expect(getValueForProperty(property, propertyName)).toBe('[\"Buy Groceries\", \"Buy Coffee\", ]');
  });

  test('gets value for string property', () => {
    const propertyName = 'SecurityID';
    const property: OpenAPIV3.SchemaObject = {
      "type": "string",
    };

    expect(typeof getValueForProperty(property, propertyName)).toBe("string");
  });

  test('gets value for integer property', () => {
    const propertyName = 'SecurityID';
    const property: OpenAPIV3.SchemaObject = {
      "type": "integer",
    };

    expect(typeof getValueForProperty(property, propertyName)).toBe("number");
  });

  test('gets value for number property', () => {
    const propertyName = 'SecurityID';
    const property: OpenAPIV3.SchemaObject = {
      "type": "number",
    };

    expect(typeof getValueForProperty(property, propertyName)).toBe("number");
  });

  test('gets value for boolean property', () => {
    const propertyName = 'SecurityID';
    const property: OpenAPIV3.SchemaObject = {
      "type": "boolean",
    };

    expect(typeof getValueForProperty(property, propertyName)).toBe("boolean");
  });

  test('gets value for array of strings', () => {
    const propertyName = 'Dogs';
    const property: OpenAPIV3.SchemaObject = {
      type: "array",
      items: {
        type: "string",
      }
    };
    const res = getValueForProperty(property, propertyName);

    expect(res).toMatch(/^\["[^"]*"(,"[^"]*"){0,4}\]$/g);
  });

  test('getObjectProperties gets example values for shallow object', () => {
    const propertyName = 'NestedProp';
    const property: OpenAPIV3.SchemaObject = {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        age: {
          type: "number",
        }
      }
    };
    const res = getObjectProperties(property, propertyName);

    expect(res).toMatch(/{\s+name:\"[A-z-.,\s]*\",age:[0-9]*\s+}/);
  });

  test('getObjectProperties for 200 response', () => {
    const exampleResponse = require('./test-specs/responses/200-with-headers-and-content.json');
    const res = getValueForProperty(exampleResponse.content["application/json"].schema, '200-test');

    expect(typeof res).toEqual('string');
    expect(res.length).toBeGreaterThan(0);
  });

  test('getObjectProperties gets example values for nested object', () => {
    const propertyName = 'NestedProp';
    const property: OpenAPIV3.SchemaObject = {
      type: "object",
      properties: {
        level1: {
          type: "object",
          properties: {
            level2: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                age: {
                  type: "number",
                }
              }
            }
          }
        }
      }
    };
    const res = getObjectProperties(property, propertyName);

    expect(res).toMatch(/{ level1:{ level2:{ name:\"[A-z-.,\s]*\",age:[0-9]*\s+}\s+}\s+}/);
  });

});



describe('Building a factory file', () => {
  test('writes a factory file for a simple model', async () => {
    const modelName = 'Member';
    const schema = require('./test-specs/schemas/PrimitivesOnlySchema.json');
    const res = await buildFactoryFile(modelName, schema);

    expect(res.length).toBeGreaterThan(0);
    expect(typeof res).toEqual("string");
  });

  test('writes a factory file for a model', async () => {
    const modelName = 'Member';
    const schema = require('./test-specs/schemas/PaymentCard.json');
    const res = await buildFactoryFile(modelName, schema);

    expect(res.length).toBeGreaterThan(0);
    expect(typeof res).toEqual("string");
  });

  test('writes a factory file for a model with example values', async () => {
    const modelName = 'Member';
    const schema = require('./test-specs/schemas/ComplexSchemaWithExamples.json');
    const res = await buildFactoryFile(modelName, schema);
    const formattedRes = await prettier.format(res, {
      semi: true, singleQuote: true, parser: 'typescript', trailingComma: 'none'
    });
    const expected = await prettier.format(exampleFactory, {
      semi: true, singleQuote: true, parser: 'typescript', trailingComma: 'none'
    });

    expect(formattedRes).toEqual(expected);
  });
});