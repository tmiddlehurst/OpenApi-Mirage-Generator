import fs, { write } from 'fs';
import { OpenAPIV3 } from 'openapi-types';
import { getModelChoicesFromSchemas, inquireModelsToCreate } from './promptForModels';
import { buildServerFile } from './buildFiles/buildServer';
import { type PromptFunction } from 'inquirer';
import { importFile, writeFile, type FileToWrite } from './utils';
import { buildModelDefinitionsFile } from './buildFiles/buildModelDefinitions';
import { buildFactoryDefinitionsFile } from './buildFiles/buildFactoryDefinitions';
import { buildFactoryFile } from './buildFiles/buildFactory';
import { getHandlersFromPaths } from './getRouteHandlerConfig';

export async function generate(inputFilePath: string, outputDir: string, prompt: PromptFunction) {
  if (!inputFilePath && typeof inputFilePath !== "string") {
    console.error("Invalid input file path provided");
  }
  if (!outputDir && typeof outputDir !== "string") {
    console.error("Invalid output dir path provided");
  }
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  } catch (e) {
    throw new Error('Unable to create output dir ');
  }

  let filesToWrite: FileToWrite[] = [];
  let spec: OpenAPIV3.Document;
  let preferredFileExtension: string;
  let hasModels = false;

  try {
    const importResult = importFile(inputFilePath);
    spec = importResult.spec as OpenAPIV3.Document;
    preferredFileExtension = importResult.preferredFileExtension;
  } catch (e) {
    throw new Error(`Invalid file ${inputFilePath} provided, this is not valid JSON or YAML. ${e}`);
  }

  console.log(spec.components?.schemas);
  if (spec.components && spec.components.schemas && Object.keys(spec.components.schemas).length) {
    // TODO: does this work still?
    const { models } = await inquireModelsToCreate(prompt, spec.components.schemas as Record<string, OpenAPIV3.SchemaObject>);

    console.log("models to create: ", models);

    if (models.length) {
      hasModels = true;
      filesToWrite.push({ fileName: 'models.ts', content: buildModelDefinitionsFile(models) });
      filesToWrite.push({ fileName: 'factories.ts', content: buildFactoryDefinitionsFile(models) });
      models.forEach((modelName: string) => {
        filesToWrite.push({ fileName: `factories/${modelName}.ts`, content: buildFactoryFile(modelName, spec.components?.schemas[modelName]) });
      });
    }
  }


  const routeHandlerConfig = getHandlersFromPaths(spec.paths);
  // const handlerFiles: string[] = await writeRouteHandlerFiles(spec);
  // map() writeRouteHandlerFile

  filesToWrite.push({ fileName: 'server.ts', content: buildServerFile(routeHandlerConfig) });

  for (const fileToWrite of filesToWrite) {
    console.log('writing file: ', fileToWrite.fileName);
    writeFile(fileToWrite, outputDir);
  }

}