import camelcase from 'camelcase';

export default function buildFactoryDefinitionsFile(modelNames: string[]): string {
  const factoryDefinitions: string = modelNames.reduce((definitions, modelName) => {
    return definitions + `${camelcase(modelName)}: ${modelName}Factory,`;
  }, '');

  const imports: string = modelNames.reduce((imports, modelName) => {
    return imports + `import ${modelName}Factory from \'./factories/${modelName}\';\n`;
  }, '');

  const file = `
    ${imports}

    export const factories = {
      ${factoryDefinitions}
    };`;

  return file;
}