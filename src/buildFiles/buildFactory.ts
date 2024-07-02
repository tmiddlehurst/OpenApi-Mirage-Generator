import type { OpenAPIV3 } from 'openapi-types';
import { getExampleValue } from '../getExampleValue';

export function buildFactoryFile(modelName: string, schemaDefinition: OpenAPIV3.SchemaObject): string {
  const rawFile = `import { Factory } from 'miragejs';

  export default Factory.extend(
    ${getExampleValue(schemaDefinition, modelName)}
  )
  `;
  return rawFile;
}
