import camelcase from 'camelcase';

export function buildModelDefinitionsFile(modelNames: string[]): string {
  const modelDefinitions: string = modelNames.reduce((definitions, modelName) => {
    return definitions + `
      const ${modelName}Model = <ModelDefinition>Model.extend({});`;
  }, '');
  const modelsMap: string = modelNames.reduce((definitions, modelName) => {
    return definitions + `${camelcase(modelName)}: ${modelName}Model,`;
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