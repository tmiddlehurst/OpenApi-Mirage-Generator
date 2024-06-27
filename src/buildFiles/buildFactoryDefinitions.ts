import camelcase from 'camelcase';

export function buildFactoryDefinitionsFile(modelNames: string[]): string {
  const factoryDefinitions: string = modelNames.reduce((definitions, modelName) => {
    return definitions + `${camelcase(modelName)}: ${modelName}Factory,`;
  }, '');

  const file = `
    import MemberFactory from './factories/member';
    import PaymentCardFactory from './factories/paymentCard';

    export const factories = {
      ${factoryDefinitions}
    };`;

  return file;
}