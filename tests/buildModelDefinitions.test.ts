import { buildModelDefinitionsFile } from '../src/buildFiles/buildModelDefinitions';
import { describe, test, expect } from 'bun:test';
import { format } from '../src/utils';

const exampleModels = `
import { Model } from 'miragejs';
import type { ModelDefinition } from "miragejs/-types";

const MemberModel = <ModelDefinition>Model.extend({});
const PaymentCardModel = <ModelDefinition>Model.extend({});

export const models = {
  member: MemberModel,
  paymentCard: PaymentCardModel
};`;

describe("building model definitions", () => {
  test('writes model definitions file from modelNames', async () => {
    const modelNames = ['Member', 'PaymentCard'];
    const buildResult = await buildModelDefinitionsFile(modelNames);

    const expectedOutput = await format(exampleModels);
    const input = await format(buildResult);
    expect(input).toBe(expectedOutput);
  });
});