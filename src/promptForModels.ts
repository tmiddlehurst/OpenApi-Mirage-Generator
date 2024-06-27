import { type CheckboxChoiceOptions, type PromptFunction } from 'inquirer';
import type { OpenAPIV3 } from 'openapi-types';

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

export function isPluralOfOtherSchema(name: string, schemaNames: string[]): boolean {
  name = name.toUpperCase();
  if (name.endsWith('S')) {
    console.log(`${name} is plural`);
    if (schemaNames.map(s => s.toUpperCase()).includes(name.slice(0, -1))) {
      console.log(`${name} is plural of other string in list`);
      return true;
    } else return false;
  } else {
    console.log(`${name} is not plural`);
    return false;
  }
}
