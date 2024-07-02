import fs from 'fs';
import path from 'node:path';
import { OpenAPIV3 } from 'openapi-types';
import { inquireModelsToCreate } from './promptForModels';
import { buildServerFile } from './buildFiles/buildServer';
import { type PromptFunction } from 'inquirer';
import { importFile, writeFile, type FileToWrite } from './utils';
import { buildModelDefinitionsFile } from './buildFiles/buildModelDefinitions';
import { buildFactoryDefinitionsFile } from './buildFiles/buildFactoryDefinitions';
import { buildFactoryFile } from './buildFiles/buildFactory';
import { getHandlersFromPaths, type HandlerConfig } from './getRouteHandlerConfig';
import { buildRouteHandler } from './buildFiles/buildRouteHandler';
import { resolveRefs } from './resolveRefs';

export async function generate(inputFilePath: string, outputDir: string, prompt: PromptFunction) {
  if (!inputFilePath && typeof inputFilePath !== "string") {
    console.error("Invalid input file path provided");
  }
  try {
    if (!outputDir || typeof outputDir !== "string") {
      console.error("Invalid output dir path provided");
    }
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  } catch (e) {
    throw new Error('Unable to create output dir ');
  }

  let filesToWrite: FileToWrite[] = [];
  let spec: OpenAPIV3.Document;

  try {
    spec = importFile(inputFilePath);
    spec = resolveRefs(spec);
  } catch (e) {
    throw new Error(`Invalid file ${inputFilePath} provided, this is not valid JSON or YAML. ${e}`);
  }

  if (spec?.components?.schemas && Object.keys(spec.components.schemas).length) {
    const { models } = await inquireModelsToCreate(prompt, spec.components.schemas as Record<string, OpenAPIV3.SchemaObject>);

    if (models.length) {
      const pathToFactories = path.join(outputDir, 'factories');
      if (!fs.existsSync(pathToFactories)) {
        fs.mkdirSync(pathToFactories);
      }
      filesToWrite.push({ fileName: 'models.ts', content: buildModelDefinitionsFile(models) });
      filesToWrite.push({ fileName: 'factories.ts', content: buildFactoryDefinitionsFile(models) });
      models.forEach((modelName: string) => {
        filesToWrite.push({ fileName: `factories/${modelName}.ts`, content: buildFactoryFile(modelName, spec.components?.schemas[modelName] as OpenAPIV3.SchemaObject) });
      });
    }
  }

  const routeHandlerConfig = getHandlersFromPaths(spec.paths);

  if (routeHandlerConfig.length) {
    const pathToHandlers = path.join(outputDir, 'handlers');
    if (!fs.existsSync(pathToHandlers)) {
      fs.mkdirSync(pathToHandlers);
    }
    routeHandlerConfig.forEach((handler: HandlerConfig) => {
      filesToWrite.push({ fileName: `handlers/${handler.name}.ts`, content: buildRouteHandler(spec.paths[handler.path][handler.method], handler.name) });
    });
  }

  filesToWrite.push({ fileName: 'server.ts', content: buildServerFile(routeHandlerConfig) });

  for (const fileToWrite of filesToWrite) {
    console.log('writing file: ', fileToWrite.fileName);
    writeFile(fileToWrite, outputDir);
  }

}