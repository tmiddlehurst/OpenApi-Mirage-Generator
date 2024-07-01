import type { OpenAPIV3 } from 'openapi-types';
import { getObjectProperties } from '../getExampleValue';

export function buildFactoryFile(modelName: string, schemaDefinition: OpenAPIV3.SchemaObject): string {
  const rawFile = `import { Factory } from 'miragejs';

  export default Factory.extend(
    ${getObjectProperties(schemaDefinition, modelName)}
  )
  `;
  return rawFile;
}
