import { expect, test, describe } from 'bun:test';
import { getObjectProperties, getRandomStringNumberOrBool, getValueForProperty, buildFactoryFile } from '../src/buildFiles/buildFactory';
import prettier from 'prettier';
import type { OpenAPIV3 } from 'openapi-types';

const exampleFactory = "import { Factory } from 'miragejs';\n\nexport default Factory.extend({\n  valid: true,\n  modifiedDate: '2025-08-15T01:36:34.749Z',\n  nameOnCard: 'Thomas Middlehurst',\n  totalAmountDeposited: 1000,\n  scheme: 'VISA',\n  transactions: ['Buy Groceries', 'Buy Coffee']\n});\n";

describe('Getting field values', () => {

  test('gets example primitive value for a field', () => {
    expect(typeof getRandomStringNumberOrBool('total', 'number')).toBe('number');
    expect(typeof getRandomStringNumberOrBool('timestamp', 'number')).toBe('number');
    expect(typeof getRandomStringNumberOrBool('date', 'string')).toBe('string');
    expect(typeof getRandomStringNumberOrBool('country', 'string')).toBe('string');
    expect(typeof getRandomStringNumberOrBool('foo', 'string')).toBe('string');
    expect(typeof getRandomStringNumberOrBool('name', 'string')).toBe('string');
    expect(typeof getRandomStringNumberOrBool('bar', 'number')).toBe('number');
    expect(typeof getRandomStringNumberOrBool('baz', 'boolean')).toBe('boolean');
    // expect(getRandomStringNumberOrBool('startDate', 'string')).toBe('10:123:AA');
  });

  // test('gets value for string enum property', () => {
  //   const propertyName = 'PutOrCall';
  //   const property: OpenAPIV3.SchemaObject = {
  //     "type": "string",
  //     "enum": [
  //       "Put",
  //       "Call",
  //       "Chooser",
  //       "Other",
  //       "DEFAULT"
  //     ]
  //   };
  //   expect(getValueForProperty(propertyName, property)).toBe("Put");
  // });

  // test('gets value for string property with example', () => {
  //   const propertyName = 'SecurityID';
  //   const property: OpenAPIV3.SchemaObject = {
  //     "type": "string",
  //     "example": "202405220923260000235870D"
  //   };
  //   expect(getValueForProperty(propertyName, property)).toBe("202405220923260000235870D");
  // });

  test('gets value for number property with example', () => {
    const propertyName = 'maturityDate';
    const property: OpenAPIV3.SchemaObject = {
      "type": "number",
      "example": 20240524
    };
    expect(getValueForProperty(propertyName, property)).toBe(20240524);
  });

  test('gets value for integer property with example', () => {
    const propertyName = 'maturityDate';
    const property: OpenAPIV3.SchemaObject = {
      "type": "integer",
      "example": 20240524
    };
    expect(getValueForProperty(propertyName, property)).toBe(20240524);
  });

  // test('gets value for string property with example', () => {
  //   const propertyName = 'SecurityID';
  //   const property: OpenAPIV3.SchemaObject = {
  //     "type": "string",
  //     "example": "202405220923260000235870D"
  //   };
  //   expect(getValueForProperty(propertyName, property)).toBe("202405220923260000235870D");
  // });

  // test('gets value for array property of type string with example', () => {
  //   const propertyName = 'transactions';
  //   const property: OpenAPIV3.SchemaObject = {
  //     "type": "array",
  //     "items": {
  //       "type": "string"
  //     },
  //     "example": [
  //       "Buy Groceries",
  //       "Buy Coffee"
  //     ]
  //   };
  //   expect(getValueForProperty(propertyName, property)).toBe("202405220923260000235870D");
  // });

  test('gets value for string property', () => {
    const propertyName = 'SecurityID';
    const property: OpenAPIV3.SchemaObject = {
      "type": "string",
    };
    expect(typeof getValueForProperty(propertyName, property)).toBe("string");
  });

  test('gets value for integer property', () => {
    const propertyName = 'SecurityID';
    const property: OpenAPIV3.SchemaObject = {
      "type": "integer",
    };
    expect(typeof getValueForProperty(propertyName, property)).toBe("number");
  });

  test('gets value for number property', () => {
    const propertyName = 'SecurityID';
    const property: OpenAPIV3.SchemaObject = {
      "type": "number",
    };
    expect(typeof getValueForProperty(propertyName, property)).toBe("number");
  });

  test('gets value for boolean property', () => {
    const propertyName = 'SecurityID';
    const property: OpenAPIV3.SchemaObject = {
      "type": "boolean",
    };
    expect(typeof getValueForProperty(propertyName, property)).toBe("boolean");
  });

  // test('gets example value for array of strings', () => {
  //   const propertyName = 'Dogs';
  //   const property: OpenAPIV3.SchemaObject = {
  //     type: "array",
  //     items: {
  //       type: "string",
  //     }
  //   };

  //   const res = getValueForProperty(propertyName, property);
  //   res.forEach((val) => {
  //     expect(typeof val).toBe('string');
  //   });
  //   expect(res.length < 6).toBe(true);
  //   expect(res.length > 0).toBe(true);
  // });

  // test('getObjectProperties gets example values for shallow object', () => {
  //   const propertyName = 'NestedProp';
  //   const property: OpenAPIV3.SchemaObject = {
  //     type: "object",
  //     properties: {
  //       name: {
  //         type: "string",
  //       },
  //       age: {
  //         type: "number",
  //       }
  //     }
  //   };

  //   const testRegexp = new RegExp(/{ name:[a-z]*,age:[0-9]* }/);
  //   const res = getObjectProperties(propertyName, property);
  //   expect(testRegexp.test(res)).toEqual(true);
  // });

  // test('getObjectProperties gets example values for nested object', () => {
  //   const propertyName = 'NestedProp';
  //   const property: OpenAPIV3.SchemaObject = {
  //     type: "object",
  //     properties: {
  //       level1: {
  //         type: "object",
  //         properties: {
  //           level2: {
  //             type: "object",
  //             properties: {
  //               name: {
  //                 type: "string",
  //               },
  //               age: {
  //                 type: "number",
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   };

  //   const res = getObjectProperties(propertyName, property);
  //   console.log(res);
  //   const testRegexp = new RegExp(/{ level1:{ level2:{ name:[a-z]*,age:[0-9]* } } }/s);
  //   expect(testRegexp.test(res)).toEqual(true);
  // });

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
    console.log(schema);
    const res = await buildFactoryFile(modelName, schema);

    expect(res.length).toBeGreaterThan(0);
    expect(typeof res).toEqual("string");
  });

  // Failing
  test('writes a factory file for a model with example values', async () => {
    const modelName = 'Member';
    const schema = require('./test-specs/schemas/ComplexSchemaWithExamples.json');
    const res = await buildFactoryFile(modelName, schema);
    console.log(res);

    const formattedRes = await prettier.format(res, {
      semi: true, singleQuote: true, parser: 'typescript', trailingComma: 'none'
    });
    const expected = await prettier.format(exampleFactory, {
      semi: true, singleQuote: true, parser: 'typescript', trailingComma: 'none'
    });
    expect(formattedRes).toEqual(expected);
  });
});