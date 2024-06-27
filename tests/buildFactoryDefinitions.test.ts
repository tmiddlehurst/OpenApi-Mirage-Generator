import { buildFactoryDefinitionsFile } from '../src/buildFiles/buildFactoryDefinitions';
import { describe, test, expect } from 'bun:test';
import { format } from '../src/utils';

const exampleFactoriesFile = `
import MemberFactory from './factories/member';
import PaymentCardFactory from './factories/paymentCard';

export const factories = {
  member: MemberFactory,
  paymentCard: PaymentCardFactory
};`;

describe("building factory definitions", () => {
  test('writes factory definitions file from modelNames', async () => {
    const modelNames = ['Member', 'PaymentCard'];
    const buildResult = await buildFactoryDefinitionsFile(modelNames);

    const expectedOutput = await format(exampleFactoriesFile);
    const input = await format(buildResult);
    expect(input).toBe(expectedOutput);
  });
});