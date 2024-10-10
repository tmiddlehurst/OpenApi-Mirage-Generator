import { type CheckboxChoiceOptions, type PromptFunction } from 'inquirer';
import type { OpenAPIV3 } from 'openapi-types';
import { isPluralOfOtherSchema } from './utils';

const SCHEMA_NAMES_IGNORE_LIST: string[] = [
  "ERROR", "SORT", "PAGEABLE"
];

export default async function promptUserForModels(prompt: PromptFunction, schemas: Record<string, OpenAPIV3.SchemaObject>): Promise<Record<string, any>> {
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
      console.debug(`Schema ${name} disabled since it is plural of other named schema`);
      modelChoices.push({ name, value: name, checked: false });
    } else if (SCHEMA_NAMES_IGNORE_LIST.includes(name.toUpperCase())) {
      console.debug(`Schema ${name} option disabled since it is named in schema ignnore list`);
      modelChoices.push({ name, value: name, checked: false });
    } else if (schemas[name].type !== "object") {
      console.debug(`Excluding schema ${name} since it is not of type "object"`);
      modelChoices.push({ name, value: name, checked: false });
    } else {
      modelChoices.push({ name, value: name, checked: true });
    }
  }

  return modelChoices;
}
