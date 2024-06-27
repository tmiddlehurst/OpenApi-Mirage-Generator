import type { OpenAPIV3 } from 'openapi-types';
import fs from 'fs';
import YAML from 'yaml';
import prettier from 'prettier';

export function importFile(filePath: string): { spec: OpenAPIV3.Document, preferredFileExtension: string; } {
  const isYaml: boolean = new RegExp(/\.ya?ml$/).test(filePath);
  const input = fs.readFileSync(filePath, "utf8");
  const parsedSpec: OpenAPIV3.Document = isYaml ? YAML.parse(input) : JSON.parse(input);
  return { spec: parsedSpec, preferredFileExtension: filePath.split('.').pop() as string };
}

export type FileToWrite = {
  fileName: string;
  content: string;
};

export function writeFile(fileToWrite: FileToWrite, outputDir: string): void {
  // TODO: prepend outputDir
  return fs.writeFileSync(fileToWrite.fileName, fileToWrite.content);
}

export function format(input: string, name?: string): Promise<string> {
  return prettier.format(input, {
    semi: true, singleQuote: true, parser: 'typescript', trailingComma: 'none'
  }).then((value: string) => value, (reason: any) => {
    console.error('Error formatting input: ', name, reason);
    return '';
  });
}