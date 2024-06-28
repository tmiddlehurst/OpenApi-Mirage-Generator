import { type CheckboxChoiceOptions, type PromptFunction } from 'inquirer';
import type { OpenAPIV3 } from 'openapi-types';
import { isPluralOfOtherSchema } from './utils';

const SCHEMA_NAMES_IGNORE_LIST: string[] = [
  "ERROR", "SORT", "PAGEABLE"
];

export async function inquireModelsToCreate(prompt: PromptFunction, schemas: Record<string, OpenAPIV3.SchemaObject>): Promise<Record<string, any>> {
  const choices: CheckboxChoiceOptions[] = getModelChoicesFromSchemas(schemas);
  const displayOptions = [];

  displayOptions.push({
    type: 'checkbox',
    name: 'models',
    message: 'Select which models to create',
    choices,
  });

  const userInput = await prompt(displayOptions);
  return userInput;
}

export function getModelChoicesFromSchemas(schemas: Record<string, OpenAPIV3.SchemaObject>): CheckboxChoiceOptions[] {
  const modelChoices: CheckboxChoiceOptions[] = [];
  const schemaNames = Object.keys(schemas);

  for (const name of schemaNames) {
    if (isPluralOfOtherSchema(name, schemaNames)) {
      console.log(`schema ${name} disabled since it is plural of other named schema`);
      modelChoices.push({ name, value: name, checked: false });
    } else if (SCHEMA_NAMES_IGNORE_LIST.includes(name.toUpperCase())) {
      console.log(`schema ${name} option disabled since it is named in schema ignnore list`);
      modelChoices.push({ name, value: name, checked: false });
    } else if (schemas[name].type !== "object") {
      // TODO: handle "anyOf" etc.
      console.log(`excluding schema ${name} since it is not of type "object"`);
    } else {
      modelChoices.push({ name, value: name });
    }
  }

  return modelChoices;
}
