// const fs = require('fs');
// const yaml = require('yaml');
import fs, { write } from 'fs';
import YAML from 'yaml';
import { OpenAPIV3 } from 'openapi-types';
import { getModelChoicesFromSchemas } from './getCliChoicesForModelDefinitions';
import { writeFactoriesDefinitionsFile, writeFactoryFile, writeModelDefinitionsFile, writeRouteHandlerFiles, writeRouteHandlers, writeServerFile } from './writeFiles';

export function importFile(filePath: string): { spec: OpenAPIV3.Document, preferredFileExtension: string } {
  const isYaml: boolean = ['yml', 'yaml'].includes(inputFileExtension as string);
  const input = fs.readFileSync(filePath, "utf8");
  const parsedSpec: OpenAPIV3.Document = isYaml ? YAML.parse(input) : JSON.parse(input);
  return { spec: parsedSpec, preferredFileExtension: filePath.split('.').pop() as string };
}

async function generate(inputFilePath: string, outputDir: string) {
  if (!inputFilePath && typeof inputFilePath !== "string") {
    console.error("Invalid input file path provided");
  }
  if (!outputDir && typeof outputDir !== "string") {
    console.error("Invalid output dir path provided");
  }
  const models = {};
  let spec: OpenAPIV3.Document, preferredFileExtension;

  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  } catch (e) {
    console.error('Unable to create output dir ')
  }

  try {
    const importResult = importFile(inputFilePath);
    spec = importResult.spec as OpenAPIV3.Document;
    preferredFileExtension = importResult.preferredFileExtension;
  } catch (e) {
    console.error(`Invalid file ${inputFilePath} provided, this is not valid JSON or YAML`);
  }

  console.log(spec.components?.schemas);
  const modelsToCreate: string[] = getModelChoicesFromSchemas(parsedSchema.components.schemas);

  const modelDefinitionsFile: string = await writeModelDefinitionsFile(modelsToCreate)
  const factoryDefinitionsFiles: string = await writeFactoriesDefinitionsFile(modelsToCreate);
  const serverFile: string = await writeServerFile(spec);
  const handlerFiles: string[] = await writeRouteHandlerFiles(spec);
  const factoryFiles: string[] = await modelsToCreate.map((modelName) => writeFactoryFile(modelName, spec.components?.schemas[modelName]));

}

// generate(Bun.argv[2], Bun.argv[3]);
// inquireModelsToCreate(
//   [{ name: 'cats', value: 'cats', checked: true },
//   { name: 'dogs', value: 'dogs', checked: false }]
// )