import type { OpenAPIV3 } from 'openapi-types';
import fs from 'fs';
import path from 'node:path';
import YAML from 'yaml';
import prettier from 'prettier';

export function importFile(filePath: string): OpenAPIV3.Document {
  const isYaml: boolean = new RegExp(/\.ya?ml$/).test(filePath);
  const input = fs.readFileSync(filePath, "utf8");
  const parsedSpec: OpenAPIV3.Document = isYaml ? YAML.parse(input) : JSON.parse(input);
  return parsedSpec;
}

export type FileToWrite = {
  fileName: string;
  content: string;
};

export async function writeFile(fileToWrite: FileToWrite, outputDir: string): Promise<void> {
  if (!fs.existsSync('factories')) {
    console.log('factories does not exist');
  }
  const formattedFile = await format(fileToWrite.content);
  return fs.writeFileSync(path.join(outputDir, fileToWrite.fileName), formattedFile);
}

export function format(input: string, name?: string): Promise<string> {
  return prettier.format(input, {
    semi: true, singleQuote: true, parser: 'typescript', trailingComma: 'none'
  }).then((value: string) => value, (reason: any) => {
    console.error('Error formatting input: ', name, reason);
    return '';
  });
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