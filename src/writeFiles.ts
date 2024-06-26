import camelcase from 'camelcase';
import prettier from 'prettier';
import { faker } from '@faker-js/faker';
import type { OpenAPIV3 } from 'openapi-types';

export function writeRouteHandlerFiles(spec: OpenAPIV3.Document): string[] {

}

export function writeRouteHandlerConfig(spec: OpenAPIV3.Document): { handlerImports: string; routes: string } {
  const handlerImports = '';
  const routes = '';

  return { handlerImports, routes };
}

export function writeServerFile(spec: OpenAPIV3.Document): string {
  const { handlerImports, routes } = writeRouteHandlerConfig(spec);

  return `
    import { createServer, JSONAPISerializer } from 'miragejs';
    import { factories } from './factories';
    import { models } from './models';
    ${handlerImports}

    const server = createServer({
      environment: 'test'
      models,
      factories,

      serializers: {
        application: JSONAPISerializer,
      },

      seeds(server) {},

      routes() {
        ${routes}
      }
    }); `;
}

export function writeModelDefinitionsFile(modelNames: string[]): string {
  const modelDefinitions: string = modelNames.reduce((definitions, modelName) => {
    return definitions + `
      const ${modelName}Model = <ModelDefinition>Model.extend({});`;
  }, '');
  const modelsMap: string = modelNames.reduce((definitions, modelName) => {
    return definitions + `${camelcase(modelName)}: ${modelName}Model,`
  }, '');

  console.log(modelsMap);

  const file = `
    import { Model } from 'miragejs';
    import type { ModelDefinition } from "miragejs/-types";

    ${modelDefinitions}

    export const models = {
      ${modelsMap}
    };`;
  return file;
}

export function writeFactoriesDefinitionsFile(modelNames: string[]): string {
  const factoryDefinitions: string = modelNames.reduce((definitions, modelName) => {
    return definitions + `${camelcase(modelName)}: ${modelName}Factory,`
  }, '');

  const file = `
    import MemberFactory from './factories/member';
    import PaymentCardFactory from './factories/paymentCard';

    export const factories = {
      ${factoryDefinitions}
    };`;

  return file;
}

export async function writeFactoryFile(modelName: string, schemaDefinition: OpenAPIV3.SchemaObject): string {
  console.log(schemaDefinition);

  const rawFile = `  import { Factory } from 'miragejs';

  export default Factory.extend(
    ${getObjectProperties(modelName, schemaDefinition)}
  )
    `
  // const file = await format(rawFile, `${ modelName } Factory`);
  return rawFile;
}

function format(input: string, name: string): Promise<string> {
  return prettier.format(input, {
    semi: true, singleQuote: true, parser: 'typescript', trailingComma: 'none'
  }).then((value: string) => value, (reason: any) => {
    console.error('Error formatting input: ', name, reason);
    return '';
  });
}

// string
// integer
// number
// object
// array
// boolean
// ref

export function getObjectProperties(objectName: string, object: OpenAPIV3.SchemaObject): string {
  console.log('getting values for properties of: ', objectName);
  const propertyNames = Object.keys(object.properties);
  return `{ ${propertyNames.reduce((props, propertyName, i) => {
    const commaIfNotLastItem = i === propertyNames.length - 1 ? '' : ',';
    return props + `${propertyName}:${getValueForProperty(propertyName, object.properties[propertyName])}${commaIfNotLastItem}`;
  }, '')
    }
  } `;
}

// TODO: return these as optional if a "required" array is present and the prop is not in it? Maybe only relevant to typescript

// TODO: should this return real values, e.g bool, string, array, object, then they are stringified in getObjectProperties()?
export function getValueForProperty(propertyName: string, property: OpenAPIV3.SchemaObject) {
  // TODO: handle ref here

  console.log(`Property ${propertyName} is of type ${property.type
    } `);
  if (property.type === 'array') {
    const max = property.maxItems || 5;
    const min = property.minItems || 1;
    const randomInt = faker.number.int({ min, max });
    const arr = []
    for (let i = 0; i < randomInt; i++) {
      arr.push(getValueForProperty(propertyName, property.items))
    }
    return "[" + arr + "]";
  }
  if (property.type === 'object') {
    return getObjectProperties(propertyName, property);
  }
  if (property.type === 'string') {
    if (property.example) {
      return `"${property.example}"`;
    }
    if (property.enum) {
      return `"${property.enum[0]}"`;
    }
  }
  if (property.enum) {
    return property.enum[0];
  }
  return getRandomStringNumberOrBool(propertyName, property.type);
}

export function getRandomStringNumberOrBool(propertyName: string, type: string): string | number | boolean | null {
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
