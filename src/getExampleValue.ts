import { faker } from '@faker-js/faker';
import type { OpenAPIV3 } from 'openapi-types';

export function getObjectProperties(object: OpenAPIV3.SchemaObject, objectName?: string): string {
  console.log('getting values for properties of: ', objectName);
  const propertyNames = Object.keys(object.properties);
  return `{ ${propertyNames.reduce((props, propertyName, i) => {
    const commaIfNotLastItem = i === propertyNames.length - 1 ? '' : ',';
    return props + `${propertyName}:${getValueForProperty(object.properties[propertyName], propertyName)}${commaIfNotLastItem}`;
  }, '')
    }
  } `;
}

// TODO: return these as optional if a "required" array is present and the prop is not in it? Maybe only relevant to typescript

// TODO: should this return real values, e.g bool, string, array, object, then they are stringified in getObjectProperties()?
export function getValueForProperty(property: OpenAPIV3.SchemaObject, propertyName?: string) {
  // TODO: handle ref here

  if (propertyName) {
    console.log(`Property ${propertyName} is of type ${property.type
      } `);
  }

  if (property.oneOf || property.anyOf) {
    // return object compliant with the first object in the list
  }
  if (property.allOf) {
    // merge all objects in list and return an example object which complies with this
  }
  if (property.type === 'array') {
    if (property.example) {
      if (property.items.type === "string") {
        return "[" + property.example.reduce((acc, item) => acc + `"${item}", `, '') + "]";
      }
      return "[" + property.example + "]";
    }
    const max = property.maxItems || 5;
    const min = property.minItems || 1;
    const randomInt = faker.number.int({ min, max });
    const arr = [];
    for (let i = 0; i < randomInt; i++) {
      arr.push(getValueForProperty(property.items, propertyName));
    }
    return "[" + arr + "]";
  }
  if (property.type === 'object') {
    return getObjectProperties(property, propertyName);
  }
  if (property.type === 'string') {
    if (property.enum) {
      return `"${property.enum[0]}"`;
    }
  }
  if (property.enum) {
    return property.enum[0];
  }
  if (property.example) {
    // string example values must be explicitly wrapped in quotes when added to the file template
    if (typeof property.example === 'string') {
      return `"${property.example}"`;
    }
    return property.example;
  }

  return getRandomStringNumberOrBool(property.type, propertyName);
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