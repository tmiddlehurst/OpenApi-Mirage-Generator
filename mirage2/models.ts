import { Model } from 'miragejs';
import type { ModelDefinition } from 'miragejs/-types';

const PetModel = <ModelDefinition>Model.extend({});

export const models = {
  pet: PetModel
};
