import inquirer from 'inquirer';
import type { OpenAPIV3 } from 'openapi-types';

const SCHEMA_NAMES_IGNORE_LIST: string[] = [
  "ERROR", "SORT", "PAGEABLE"
]


export async function inquireModelsToCreate(choices: CliChoice[]): Promise<string[]> {
  const displayOptions = [];

  displayOptions.push({
    type: 'checkbox',
    name: 'models',
    message: 'Select which models to create',
    choices,
  });

  const userInput = await inquirer.prompt(displayOptions);
  return userInput;
}


type CliChoice = {
  name: string;
  value: string;
  checked?: boolean;
}

type Schemas = {
  [key: string]: OpenAPIV3.NonArraySchemaObject
}

export function getModelChoicesFromSchemas(schemas: Schemas): CliChoice[] {
  const modelChoices: CliChoice[] = []
  const schemaNames = Object.keys(schemas);

  for (const name of schemaNames) {
    if (isPluralOfOtherSchema(name, schemaNames)) {
      console.log(`schema ${name} disabled since it is plural of other named schema`)
    } else if (SCHEMA_NAMES_IGNORE_LIST.includes(name.toUpperCase())) {
      console.log(`excluding schema ${name} since it is named in schema ignnore list`)
    } else if (schemas[name].type !== "object") {
      console.log(`excluding schema ${name} since it is not of type "object"`)
    } else {
      modelChoices.push({ name, value: name })
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
